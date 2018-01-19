import { Contracts } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";

export type TypeDefinitions = Contracts.TypeLiteralType |
    Contracts.MappedType |
    Contracts.FunctionTypeType |
    Contracts.ThisType |
    Contracts.ConstructorType;

export class ApiTypeDefinition<TKind extends Contracts.ApiReferenceBaseType = TypeDefinitions> extends ApiTypeReferenceBase<TKind> {
    public ToText(): string[] {
        if (this.ReferenceItem == null) {
            // TODO: Add log for missing reference.
            return ["???"];
        }

        return this.ReferenceItem.ToText();
    }
}
