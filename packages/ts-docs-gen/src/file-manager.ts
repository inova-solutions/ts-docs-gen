import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder, Contracts as MarkdownContracts } from "@simplrjs/markdown";
import { LogLevel } from "simplr-logger";
import * as path from "path";

import { Helpers } from "./utils/helpers";
import { PluginResult, PluginHeading } from "./contracts/plugin";
import { FileResult } from "./contracts/file-result";
import { GeneratorHelpers } from "./generator-helpers";
import { ApiContainer, ContainerMembersKindsGroup } from "./abstractions/container-plugin";
import { ApiClassPlugin } from "./plugins/api-class-plugin";
import { ApiSourceFilePlugin } from "./plugins/api-source-file-plugin";
import { ApiNamespacePlugin } from "./plugins/api-namespace-plugin";

// TODO: remove unused files before generating docs.
export class FileManager {
    constructor(private extractedData: ExtractDto) { }

    /**
     * <FileLocation, RenderedItems>
     */
    private filesList: Map<string, PluginResult<ApiContainer>> = new Map();
    /**
     * <ReferenceId, FileLocation>
     */
    private referenceToFile: Map<string, string> = new Map();

    private resolveMemberKindsList(apiItemKind: Contracts.ApiDefinitionKind): ContainerMembersKindsGroup[] | undefined {
        switch (apiItemKind) {
            case Contracts.ApiDefinitionKind.Class: {
                return ApiClassPlugin.MemberKindsList;
            }
            case Contracts.ApiDefinitionKind.Namespace: {
                return ApiNamespacePlugin.MemberKindsList;
            }
            case Contracts.ApiDefinitionKind.SourceFile: {
                return ApiSourceFilePlugin.MemberKindsList;
            }
        }
    }

    private renderTableOfContents(containerResult: PluginResult<ApiContainer>): string[] {
        const memberKindsList = this.resolveMemberKindsList(containerResult.ApiItem.ApiKind);

        if (memberKindsList == null) {
            return [];
        }

        const tableList: MarkdownContracts.MarkdownList = [];

        containerResult.Headings.forEach(heading => {
            const headingMembers = heading.Members;
            if (headingMembers == null || headingMembers.length === 0) {
                return;
            }

            // Adding first level heading link.
            const headingLink = MarkdownGenerator.Link(heading.Heading, heading.ApiItemId, true);
            tableList.push(headingLink);

            memberKindsList.forEach(memberKindGroup => {
                // Filtering headings by kind group.
                const membersOfKind = headingMembers
                    .filter(x => memberKindGroup.Kinds.indexOf(this.extractedData.Registry[x.ApiItemId].ApiKind) !== -1);

                if (membersOfKind.length === 0) {
                    return [];
                }

                const membersReferences = membersOfKind.map(x => MarkdownGenerator.Link(x.Heading, x.ApiItemId, true));

                // Adding headings of single kind group.
                tableList.push([memberKindGroup.Heading, membersReferences]);
            });
        });

        if (tableList.length === 0) {
            return [];
        }

        return new MarkdownBuilder()
            .Header("Table of contents", 1)
            .EmptyLine()
            .UnorderedList(tableList)
            .EmptyLine()
            .GetOutput();
    }

    public AddEntryFile(itemResult: PluginResult<ApiContainer>): void {
        const filePath = path.basename(
            itemResult.ApiItem.Location.FileName,
            path.extname(itemResult.ApiItem.Location.FileName
            )
        ) + GeneratorHelpers.MARKDOWN_EXT;

        this.AddItem(itemResult, filePath);
    }

    private addItemHeadings(headings: PluginHeading[], filePath: string): void {
        for (const heading of headings) {
            this.referenceToFile.set(heading.ApiItemId, `${filePath}#${Helpers.HeadingToAnchor(heading.Heading)}`);

            if (heading.Members != null) {
                this.addItemHeadings(heading.Members, filePath);
            }
        }
    }

    private resolveReferenceFile(referenceId: string): string | undefined {
        const apiItem = this.extractedData.Registry[referenceId];
        const serializedApiItem = GeneratorHelpers
            .SerializeApiDefinition(this.extractedData, apiItem, { Alias: apiItem.Name, Id: referenceId });

        if (!this.referenceToFile.has(referenceId) && serializedApiItem.ParentItem != null) {
            return this.resolveReferenceFile(serializedApiItem.ParentItem.Reference.Id);
        }

        return this.referenceToFile.get(referenceId);
    }

    private removeBrokenLinks(result: string[], referenceId: string): string[] {
        const linkDefinition = new RegExp(`\\[(.+)\\]\\[${referenceId}\\]`, "g");
        return result.map(x => x.replace(linkDefinition, "$1"));
    }

    public AddItem(itemResult: PluginResult<ApiContainer>, filePath: string): void {
        if (this.filesList.get(filePath) == null) {
            this.filesList.set(filePath, itemResult);
        }

        this.filesList.set(filePath, itemResult);
        // Adding headings.
        this.addItemHeadings(itemResult.Headings, filePath);

        // HeadingsMap
        if (itemResult.Members != null) {
            for (const member of itemResult.Members) {
                const baseName = path.basename(filePath, path.extname(filePath));
                const targetFilePath = path.join(
                    path.dirname(filePath),
                    baseName,
                    member.PluginResult.ApiItem.Name + GeneratorHelpers.MARKDOWN_EXT
                ).toLowerCase();

                this.AddItem(member.PluginResult, targetFilePath);
            }
        }
    }

    public ToFilesOutput(skipTableOfContents: boolean): FileResult[] {
        const files: FileResult[] = [];

        for (const [fileLocation, item] of this.filesList) {

            // Link definitions to file location.
            const linkDefinitions: string[] = [];
            // Plugin result.
            let pluginResult = item.Result;
            item.UsedReferences.forEach(referenceId => {
                const filePath = path.dirname(fileLocation);

                const referenceString = this.resolveReferenceFile(referenceId);
                // referenceString is not falsy.
                if (referenceString) {
                    const resolvePath = GeneratorHelpers.StandardizePath(path.relative(filePath, referenceString));

                    linkDefinitions.push(
                        MarkdownGenerator.LinkDefinition(referenceId, resolvePath)
                    );
                } else {
                    // Removes broken links.
                    pluginResult = this.removeBrokenLinks(pluginResult, referenceId);
                    const apiItem = this.extractedData.Registry[referenceId];

                    GeneratorHelpers.LogWithApiItemPosition(
                        LogLevel.Warning,
                        apiItem,
                        "Declaration is used as type and not exported in entry files."
                    );
                }
            });

            const tabelOfContents = skipTableOfContents ? [] : this.renderTableOfContents(item);

            files.push({
                FileLocation: GeneratorHelpers.StandardizePath(fileLocation),
                Result: [
                    ...tabelOfContents,
                    ...pluginResult,
                    ...linkDefinitions
                ]
            });
        }

        return files;
    }
}
