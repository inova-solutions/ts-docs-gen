import { Contracts } from "ts-extractor";

import { ApiParameter } from "./api-parameter";
import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiIndex extends ApiDefinitionWithType<Contracts.ApiIndexDto> {
    private parameter: ApiParameter;

    public get Parameter(): ApiParameter {
        if (this.parameter == null) {
            const apiItem = this.ExtractedData.Registry[this.ApiItem.Parameter] as Contracts.ApiParameterDto;
            this.parameter = new ApiParameter(this.ExtractedData, apiItem, { Alias: apiItem.Name, Id: this.ApiItem.Parameter });
        }
        return this.parameter;
    }

    public ToText(): string[] {
        const readonly: string = this.ApiItem.IsReadonly ? "readonly " : "";
        const type: string = this.SerializedTypeToString(this.Type);

        return [`${readonly}[${this.Parameter.ToInlineText()}]: ${type}`];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}