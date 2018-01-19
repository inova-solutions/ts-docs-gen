# Table of contents

* [contracts.ts][SourceFile-0]
    * Interfaces
        * [ApiItemReference][InterfaceDeclaration-0]
        * [PluginHeading][InterfaceDeclaration-1]
        * [PluginMember][InterfaceDeclaration-2]
        * [PluginOptions][InterfaceDeclaration-5]
        * [PluginResultData][InterfaceDeclaration-4]
        * [PluginResult][InterfaceDeclaration-3]
        * [Plugin][InterfaceDeclaration-6]
    * Types
        * [SupportedApiItemKindType][TypeAliasDeclaration-0]
        * [GetItemPluginResultHandler][TypeAliasDeclaration-1]
        * [IsPluginResultExistsHandler][TypeAliasDeclaration-2]
        * [MappedType][TypeAliasDeclaration-3]
        * [FooTuple][TypeAliasDeclaration-4]
    * Enums
        * [ApiItemKindsAdditional][EnumDeclaration-0]

# contracts.ts

## Interfaces

### ApiItemReference

```typescript
interface ApiItemReference {
    Id: string;
    Alias: string;
}
```

**Properties**

| Name  | Type   | Optional |
| ----- | ------ | -------- |
| Id    | string | false    |
| Alias | string | false    |

----------

### PluginHeading

```typescript
interface PluginHeading {
    Heading: string;
    ApiItemId: string;
}
```

**Properties**

| Name      | Type   | Optional |
| --------- | ------ | -------- |
| Heading   | string | false    |
| ApiItemId | string | false    |

----------

### PluginMember

```typescript
interface PluginMember {
    Reference: ApiItemReference;
    PluginResult: PluginResult<ApiItemDto>;
}
```

**Properties**

| Name         | Type                     | Optional |
| ------------ | ------------------------ | -------- |
| Reference    | ApiItemReference         | false    |
| PluginResult | PluginResult<ApiItemDto> | false    |

----------

### PluginOptions

```typescript
interface PluginOptions<TKind = ApiItemDto> {
    Reference: ApiItemReference;
    ApiItem: TKind;
    ExtractedData: ExtractDto;
    GetItemPluginResult: GetItemPluginResultHandler;
    IsPluginResultExists: IsPluginResultExistsHandler;
}
```

**Type parameters**

| Name  | Default type |
| ----- | ------------ |
| TKind | ApiItemDto   |

**Properties**

| Name                 | Type                        | Optional |
| -------------------- | --------------------------- | -------- |
| Reference            | ApiItemReference            | false    |
| ApiItem              | TKind                       | false    |
| ExtractedData        | ExtractDto                  | false    |
| GetItemPluginResult  | GetItemPluginResultHandler  | false    |
| IsPluginResultExists | IsPluginResultExistsHandler | false    |

----------

### PluginResultData

```typescript
interface PluginResultData {
    Headings: PluginHeading[];
    UsedReferences: string[];
    Result: string[];
    Members: PluginMember[];
}
```

**Properties**

| Name           | Type            | Optional |
| -------------- | --------------- | -------- |
| Headings       | PluginHeading[] | false    |
| UsedReferences | string[]        | false    |
| Result         | string[]        | false    |
| Members        | PluginMember[]  | false    |

----------

### PluginResult

```typescript
interface PluginResult<TKind = ApiItemDto> extends PluginResultData {
    Reference: ApiItemReference;
    ApiItem: TKind;
}
```

**Type parameters**

| Name  | Default type |
| ----- | ------------ |
| TKind | ApiItemDto   |

**Extends**

PluginResultData

**Properties**

| Name      | Type             | Optional |
| --------- | ---------------- | -------- |
| Reference | ApiItemReference | false    |
| ApiItem   | TKind            | false    |

----------

### Plugin

```typescript
interface Plugin<TKind = ApiItemDto> {
    SupportedApiItemKinds(): SupportedApiItemKindType[];
    CheckApiItem(item: TKind): boolean;
    Render(options: PluginOptions<TKind>): PluginResult<ApiItemDto>;
}
```

**Type parameters**

| Name  | Default type |
| ----- | ------------ |
| TKind | ApiItemDto   |
#### Method

```typescript
SupportedApiItemKinds(): SupportedApiItemKindType[];
```

**Return type**

SupportedApiItemKindType[]

```typescript
CheckApiItem(item: TKind): boolean;
```

**Parameters**

| Name | Type  |
| ---- | ----- |
| item | TKind |

**Return type**

boolean

```typescript
Render(options: PluginOptions<TKind>): PluginResult<ApiItemDto>;
```

**Parameters**

| Name    | Type                 |
| ------- | -------------------- |
| options | PluginOptions<TKind> |

**Return type**

PluginResult<ApiItemDto>


## Types

### SupportedApiItemKindType

```typescript
type SupportedApiItemKindType = ApiItemKinds | Any;
```

**Type**

ApiItemKinds | Any

----------

### GetItemPluginResultHandler

```typescript
type GetItemPluginResultHandler = (reference: ApiItemReference) => PluginResult<ApiItemDto>;
```

**Type**

(reference: ApiItemReference) => PluginResult<ApiItemDto>

----------

### IsPluginResultExistsHandler

```typescript
type IsPluginResultExistsHandler = (reference: ApiItemReference) => boolean;
```

**Type**

(reference: ApiItemReference) => boolean

----------

### MappedType

```typescript
type MappedType = {
    [K extends "a-b-c"]: number
};
```

**Type**

{     [K extends "a-b-c"]: number }

----------

### FooTuple

```typescript
type FooTuple = [string, number];
```

**Type**

[string, number]

## Enums

### ApiItemKindsAdditional


```typescript
enum ApiItemKindsAdditional {
     Any = "any"
}
```

**Members**

| Name | Value |
| ---- | ----- |
| Any  | "any" |

[SourceFile-0]: contracts.md#contractsts
[InterfaceDeclaration-0]: contracts.md#apiitemreference
[InterfaceDeclaration-1]: contracts.md#pluginheading
[InterfaceDeclaration-2]: contracts.md#pluginmember
[InterfaceDeclaration-5]: contracts.md#pluginoptions
[InterfaceDeclaration-4]: contracts.md#pluginresultdata
[InterfaceDeclaration-3]: contracts.md#pluginresult
[InterfaceDeclaration-6]: contracts.md#plugin
[TypeAliasDeclaration-0]: contracts.md#supportedapiitemkindtype
[TypeAliasDeclaration-1]: contracts.md#getitempluginresulthandler
[TypeAliasDeclaration-2]: contracts.md#ispluginresultexistshandler
[TypeAliasDeclaration-3]: contracts.md#mappedtype
[TypeAliasDeclaration-4]: contracts.md#footuple
[EnumDeclaration-0]: contracts.md#apiitemkindsadditional