---
id: "_lib_didi_src_types_machine_types_.ilibdidischema"
title: "ILibDidiSchema"
sidebar_label: "ILibDidiSchema"
---

**`description`** Defines the build process

## Hierarchy

* **ILibDidiSchema**

## Index

### Properties

* [states](_lib_didi_src_types_machine_types_.ilibdidischema.md#states)

## Properties

### <a id="states" name="states"></a>  states

• **states**: *object*

Defined in packages/lib-didi/src/types/machine.types.ts:20

#### Type declaration:

* **discoveringDependencies**(): *object*

  * **states**(): *object*

    * **mappingOutput**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*

    * **searching**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*

* **result**(): *object*

  * **states**(): *object*

    * **fail**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*

    * **success**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*

* **writing**(): *object*

  * **states**(): *object*

    * **ESModule**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*

    * **ESModuleIndex**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*

    * **ESModuleShim**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*

    * **ImportMap**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*

    * **IndexHtml**: *[IdidiBuildStep](_lib_didi_src_types_machine_types_.ididibuildstep.md)*
