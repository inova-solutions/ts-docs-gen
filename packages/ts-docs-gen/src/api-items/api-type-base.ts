import { Contracts } from "ts-extractor";
import { LogLevel } from "simplr-logger";
import { SerializedApiType, ReferenceRenderHandler } from "../contracts/serialized-api-item";
import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiDefinitions } from "./api-definition-list";

export abstract class ApiTypeBase<TKind extends Contracts.ApiBaseType> extends BaseApiItemClass<TKind> implements SerializedApiType<TKind> {
    protected GetSerializedApiDefinition(referenceId: string): ApiDefinitions {
        const apiItem = this.ExtractedData.Registry[referenceId];
        return GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, { Alias: "", Id: referenceId });
    }

    protected SerializedTypeToString(render: ReferenceRenderHandler, apiType: SerializedApiType | undefined): string {
        if (apiType == null) {
            GeneratorHelpers.LogWithApiItemPosition(LogLevel.Error, this.ApiItem, "Missing type!");
            return Contracts.TypeKeywords.Unknown;
        }

        return apiType.ToInlineText(render);
    }
}
