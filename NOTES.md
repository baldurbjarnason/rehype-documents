# Document Duck notes

## Language and localisation

W3C's [Publication Manifest](https://www.w3.org/TR/pub-manifest/) has, via JSON-LD 1.1 and schema.org, a deep set of localisation and language features.

- `inLanguage` property can set the language of the publication itself and various resources in it. Useful for resources like audio that might not have easily configurable language metadata.
- You can set the default [language and direction](https://www.w3.org/TR/pub-manifest/#manifest-lang-dir) for the manifest itself.
- Almost every string value in the manifest is [localisable](https://www.w3.org/TR/pub-manifest/#value-localizable-string). That is, it can be a string, an array of strings, a `{language, direction, value}` object, or an array of those objects.

This means that you _could_ build a publication manifest that has translated values for pretty much every property there is, in multiple languages. EPUB had similiar capabilities.

However, few used them.

The goal, long term, is to support the full set of language features, preferably by letting the API consumer pass in request headers as an optional config and let a content-negotiation library pick the appropriate language.

In the meantime, we only deliver the values from the JSON without normalising them. That isn't as bad as it sounds as, currently, there aren't that many files out there in the wild using the publication manifest format so most of the manifests you are going to encounter are generated by this library itself.

You can use the `settings` object to set default values for `inLanguage` and `language` properties.

## EPUB3 refines

EPUB3 supports a refines mechanism for metadata. We don't support that yet. It's on the long term todo list. (Or, should be.)