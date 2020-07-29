---
id: "_lib_didi_dev_server_src_mod_"
title: "lib-didi-dev-server/src/mod"
sidebar_label: "lib-didi-dev-server/src/mod"
---

## Index

### Variables

* [argv](_lib_didi_dev_server_src_mod_.md#const-argv)
* [readFile](_lib_didi_dev_server_src_mod_.md#readfile)

### Functions

* [devServer](_lib_didi_dev_server_src_mod_.md#const-devserver)
* [readWithMime](_lib_didi_dev_server_src_mod_.md#const-readwithmime)

## Variables

### <a id="const-argv" name="const-argv"></a> `Const` argv

• **argv**: *Partial‹[IDevServerArgs](../interfaces/_lib_didi_dev_server_src_types_types_.idevserverargs.md) & ParsedArgs›* = minimist(process.argv.slice(2))

Defined in packages/lib-didi-dev-server/src/mod.ts:18

___

### <a id="readfile" name="readfile"></a>  readFile

• **readFile**: *readFile*

Defined in packages/lib-didi-dev-server/src/mod.ts:17

## Functions

### <a id="const-devserver" name="const-devserver"></a> `Const` devServer

▸ **devServer**(`__namedParameters`: object): *Promise‹void›*

Defined in packages/lib-didi-dev-server/src/mod.ts:27

**`description`** @didi-js/lib-didi-dev-server public interface

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`host` | undefined &#124; string |
`https` | undefined &#124; object |
`index` | undefined &#124; string |
`port` | undefined &#124; number |
`reload` | undefined &#124; object |
`root` | undefined &#124; string |
`verbose` | undefined &#124; false &#124; true |

**Returns:** *Promise‹void›*

___

### <a id="const-readwithmime" name="const-readwithmime"></a> `Const` readWithMime

▸ **readWithMime**(`ctx`: Koa.Context, `path`: string): *Promise‹void›*

Defined in packages/lib-didi-dev-server/src/mod.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | Koa.Context |
`path` | string |

**Returns:** *Promise‹void›*
