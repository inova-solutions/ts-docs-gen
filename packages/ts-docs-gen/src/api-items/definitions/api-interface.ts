import { Contracts } from "ts-extractor";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiDefinitionContainer } from "../api-definition-container";
import { ApiTypes } from "../api-type-list";
import { ApiTypeParameter } from "./api-type-parameter";

export class ApiInterface extends ApiDefinitionContainer<Contracts.ApiInterfaceDto> {
    private typeParameters: ApiTypeParameter[];

    public get TypeParameters(): ApiTypeParameter[] {
        if (this.typeParameters == null) {
            this.typeParameters = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.ApiItem.TypeParameters)
                .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);
        }
        return this.typeParameters;
    }

    private extends: ApiTypes[];

    public get Extends(): ApiTypes[] {
        if (this.extends == null) {
            this.extends = this.ApiItem.Extends
                .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
                .filter((x): x is ApiTypes => x != null);
        }
        return this.extends;
    }

    public ToText(): string[] {
        const name = this.Name;

        // TypeParameters
        const typeParameters: string = this.TypeParametersToString(this.TypeParameters);

        // Extends
        let extendsString: string;
        if (this.ApiItem.Extends != null && this.ApiItem.Extends.length > 0) {
            const typesList = this.Extends.map(x => this.SerializedTypeToString(x));

            extendsString = ` extends ${typesList.join(", ")}`;
        } else {
            extendsString = "";
        }

        // Members
        const members = this.MembersToText(this.Members, 1);

        return [
            `interface ${name}${typeParameters}${extendsString} {`,
            ...members,
            `}`
        ];
    }

    public ToHeadingText(alias?: string | undefined): string {
        return this.Name;
    }
}
