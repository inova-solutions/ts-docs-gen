import { Contracts } from "ts-extractor";

import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypeParameter } from "./definitions/api-type-parameter";
import { ApiParameter } from "./definitions/api-parameter";
import { ApiDefinitionBase } from "./api-definition-base";
import { ApiTypes } from "./api-type-list";
import { ReferenceRenderHandler } from "../contracts/serialized-api-item";

/**
 * Base class for callable api items.
 */
export abstract class ApiCallable<TKind extends Contracts.ApiCallableBaseDefinition> extends ApiDefinitionBase<TKind> {
    private parameters: ApiParameter[];

    public get Parameters(): ApiParameter[] {
        if (this.parameters == null) {
            this.parameters = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.ApiItem.Parameters)
                .map(x => this.GetSerializedApiDefinition(x))
                .filter((x): x is ApiParameter => x != null);
        }
        return this.parameters;
    }

    private typeParameters: ApiTypeParameter[];

    public get TypeParameters(): ApiTypeParameter[] {
        if (this.typeParameters == null) {
            this.typeParameters = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.ApiItem.TypeParameters)
                .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);
        }

        return this.typeParameters;
    }

    private returnType: ApiTypes | undefined;

    public get ReturnType(): ApiTypes | undefined {
        if (this.returnType == null && this.ApiItem.ReturnType != null) {
            return GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.ReturnType);
        }

        return this.returnType;
    }

    protected TypeParametersToString(render: ReferenceRenderHandler): string {
        return super.TypeParametersToString(render, this.TypeParameters);
    }

    protected ParametersToString(render: ReferenceRenderHandler): string {
        return this.Parameters
            .map(x => x.ToText())
            .join(", ");
    }

    /**
     * Example: `<TValue>(arg: TValue): void`
     * @param typeDefChar If empty string, return type is not shown. @default ": "
     */
    protected CallableToString(render: ReferenceRenderHandler, typeDefChar: string = ": "): string {
        // TypeParameters
        const typeParametersString = this.TypeParametersToString(render);

        // Parameters
        const parametersString = this.ParametersToString(render);

        // ReturnType
        const type = this.SerializedTypeToString(render, this.ReturnType);
        const returnTypeString = typeDefChar !== "" && type != null ? `${typeDefChar}${type}` : "";

        return `${typeParametersString}(${parametersString})${returnTypeString}`;
    }

    protected CallableToSimpleString(): string {
        const parameters = this.Parameters.map(x => x.Name);

        return `(${parameters.join(", ")})`;
    }
}
