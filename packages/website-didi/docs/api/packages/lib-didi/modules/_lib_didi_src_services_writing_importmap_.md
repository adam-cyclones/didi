---
id: "_lib_didi_src_services_writing_importmap_"
title: "lib-didi/src/services/writing/importMap"
sidebar_label: "lib-didi/src/services/writing/importMap"
---

## Index

### Interfaces

* [IimportMapArgs](../interfaces/_lib_didi_src_services_writing_importmap_.iimportmapargs.md)

### Functions

* [importMap](_lib_didi_src_services_writing_importmap_.md#const-importmap)

## Functions

### <a id="const-importmap" name="const-importmap"></a> `Const` importMap

▸ **importMap**(`__namedParameters`: object, `__namedParameters`: object): *Promise‹object›*

Defined in packages/lib-didi/src/services/writing/importMap.ts:19

**`description`** write an import map to allow base specifiers resolve.

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`commonJSProjectDir` | any |
`options` | any |

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`constants` | object |
`dependencies` | [IDidiTreeDependency](../interfaces/_lib_didi_src_types_machine_types_.ididitreedependency.md)[] |
`importMap` | [IDidiImportMap](../interfaces/_lib_didi_src_types_machine_types_.ididiimportmap.md) |

**Returns:** *Promise‹object›*
