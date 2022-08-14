# Sutil-Template
[![NuGet](https://img.shields.io/nuget/v/Sutil.Template)](https://www.nuget.org/packages/Sutil.Template)
[![NuGet Downloads](https://img.shields.io/nuget/dt/Sutil.Template)](https://www.nuget.org/packages/Sutil.Template)

Dotnet CLI templates for creating Sutil applications.

## Included templates
This template packs together two templates:
- Sutil - which is a standalone Sutil application
- Sutil-Safe - which is a full SAFE stack application, running:
  * Sutil for the client
  * Saturn for the server
  * Fake for the build system
  * Paket for dependency management

## Getting started
```
dotnet new -i Sutil.Template
dotnet new Sutil -n <name_of_your_project>
// OR
dotnet new Sutil-Safe -n <name_of_your_project>
```

## Contributing
In case you find any issues or have any suggestions, feel free to open an issue.
In case you want to propose changes to the templates, feel free to open a pull request.
