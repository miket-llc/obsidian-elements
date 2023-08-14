# logger [TODO]

Type definitions for a flexible but easy-to-use logging framework that abstracts away the underlying logging implementation.

## Dependencies

Supports Dependency Injection through Inversify. allowing you to create your own logger or strip out this dependency entirely for testing. 

## Default Implemntations

Default implementations are provided as modules that are currently defined in subdirectories. As of this writing, we have provided a Winston-based implementation.
