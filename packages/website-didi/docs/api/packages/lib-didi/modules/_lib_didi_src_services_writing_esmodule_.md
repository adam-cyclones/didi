---
id: "_lib_didi_src_services_writing_esmodule_"
title: "lib-didi/src/services/writing/esModule"
sidebar_label: "lib-didi/src/services/writing/esModule"
---

## Index

### Functions

* [esModule](_lib_didi_src_services_writing_esmodule_.md#const-esmodule)

## Functions

### <a id="const-esmodule" name="const-esmodule"></a> `Const` esModule

▸ **esModule**(`__namedParameters`: object, `currentDependency`: [IDidiTreeDependency](../interfaces/_lib_didi_src_types_machine_types_.ididitreedependency.md)): *Promise‹void›*

Defined in packages/lib-didi/src/services/writing/esModule.ts:13

**`description`** Remap found dependencies with new output destination information.

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`commonJSProjectDir` | any |

▪ **currentDependency**: *[IDidiTreeDependency](../interfaces/_lib_didi_src_types_machine_types_.ididitreedependency.md)*

a single dependency at (I), where I is the next module to process

**Returns:** *Promise‹void›*
