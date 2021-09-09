# Agog Textbox

## Demo

[https://agogtextbox.netlify.app/](https://agogtextbox.netlify.app/)
## Options

| Option | Default Value | Description  |
|--|--|--|
| **selector** | [data-agog-textbox] | main selector to run the plugin |
| **mainClass** | agogTextbox-main | container element css class |
| **titleClass** | agogTextbox-title | title element css class |
| **emptyClass** | agogTextbox-empty | clear icon css class |
| **subClass** | agogTextbox-sub | data container elemnt css class |
| **mainPlaceHolder** | ... | default placeholder text |
| **isMultiple** | false | default option for multiple use |
| **isTag** | false | default option for tags |
| **maxItems** | null | maximum count of options that can be entered |
| **delimiter** | , | separator to use when combining options |
| **textField** | name | default json key for text field |
| **valueField** | id | default json key for value field |
| **callbackBefore** | function() {} | function to run before plugin runs |
| **callbackAfter** | function() {} | function to run after plugin runs |

## Data Attributes (for the current element)

| Option | Values  | Description |
|--|--|--|
| **data-is-multiple** | true or false | sets the use of multi-select |
| **data-data** | json data | data for auto complete or selection  |
| **data-url** | url | url of the data you want to use |
| **data-value-field** | string | json key for value field |
| **data-text-field** | string | json key for text field |

## Other Attributes (for the current element)

| Option | Values  | Description |
|--|--|--|
| **aria-placeholder** | string | placeholder text |

## Example

    <div class="container">
        <input type="text" data-agog-textbox data-is-multiple="true" aria-placeholder="Kullanıcılar" data-data='[
        { "id": 34, "name": "İstanbul" },
        { "id": 6, "name": "Ankara" },
        { "id": 35, "name": "İzmir" },
        { "id": 26, "name": "Eskişehir" },
        { "id": 58, "name": "Sivas" }
    ]'>

        <input data-agog-textbox type="text" data-url="https://restcountries.eu/rest/v2/all"
            data-value-field="alpha3Code" data-text-field="name" aria-placeholder="Ülke girin">

        <input type="text" data-agog-textbox aria-placeholder="İlçe">
    </div>

    <script>
        agogTextbox.init();
    </script>

