# elements data model interfaces and default implementations

> ![warning](../../../docres/warning.png)
> Developers enhancing or implementing this data model need to implement or reuse an ID interface for this module. We put this responsibility on the consumer in order to avoid forcing any particular model on the application or cluttering its application code with generics, type-checking, etc. Note that identity is a fundamental concept in this model as the very philosophical definition of "distinction" requires an identity. You are free to use this model how you want, but if you're using Elements tools, default implementations, or which to have compatibility with them for your data model, you will need to implement this interface.
> 

## TODO