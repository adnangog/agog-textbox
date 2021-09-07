(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.agogTextbox = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    'use strict';

    var agogTextbox = {};
    var supports = !!document.querySelector && !!root.addEventListener;
    var settings;


    // Varsayılan ayarlar
    var defaults = {
        selector: '[type="text"]',
        mainClass: 'agogTextbox-main',
        titleClass: 'agogTextbox-title',
        emptyClass: 'agogTextbox-empty',
        subClass: 'agogTextbox-sub',
        searchClass: 'agogTextbox-search',
        clearClass: 'agogTextbox-clear',
        mainPlaceHolder: '...',
        filterPlaceHolder: 'filtrele',
        isMultiple: false,
        isTag:true,
        maxItems: null,
        delimiter: ",",
        textField: "name",
        valueField: "id",
        callbackBefore: function () {
            console.log("agogTextbox başlatılıyor.")
        },
        callbackAfter: function () {
            console.log("agogTextbox bitiriliyor.")
        }
    };


    //
    // Methods
    //



    /**
     * Handle events
     * @private
     */
    var eventHandler = function (event) {
        // @todo Do something on event
    };

    /**
     * Destroy the current initialization.
     * @public
     */
    agogTextbox.destroy = function () {


        if (!settings) return;

        agogTextbox.removeListeners();

        document.querySelectorAll("." + settings.mainClass).forEach(item => item.remove())

        settings = null;

    };

    agogTextbox.init = function (options) {

        if (!supports) return;

        agogTextbox.destroy();

        settings = Object.assign(defaults, options);

        settings.callbackBefore();

        agogTextbox.create();

        settings.callbackAfter();

    };


    agogTextbox.create = function () {

        let items = document.querySelectorAll(settings.selector);

        for (let ii = 0; ii < items.length; ii++) {
            const originalSelect = items[ii];

            originalSelect.style.display = "none";

            let isMultiple = originalSelect.dataset.isMultiple;

            let url = originalSelect.dataset.url;
            let data = originalSelect.dataset.data;
            let valueField =  originalSelect.dataset.valueField || settings.valueField;
            let textField =  originalSelect.dataset.textField || settings.textField;

            let thisSelect = document.createElement("div");
            thisSelect.classList.add(settings.mainClass);
            thisSelect.dataset.index = ii;

            let title = document.createElement("div");
            title.classList.add(settings.titleClass);

            let titleSpan = document.createElement("span");
            titleSpan.classList.add("inner");
            title.appendChild(titleSpan);

            let titleText = document.createElement("input");
            titleText.classList.add("form-item");
            titleText.placeholder = originalSelect.getAttribute("aria-placeholder") || settings.mainPlaceHolder;
            titleSpan.appendChild(titleText);

            if (isMultiple) {
                thisSelect.dataset.multiple = true;
            } else {
                let titleEmpty = document.createElement("span");
                titleEmpty.classList.add(settings.emptyClass);
                titleEmpty.style.display = "none";
                titleEmpty.innerHTML = "<i class='fas fa-times'></i>";

                title.appendChild(titleEmpty);
            }

            let sub = document.createElement("div");
            sub.classList.add(settings.subClass);


            if (url) {
                fetch(url).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    for (let dIndex = 0; dIndex < data.length; dIndex++) {
                        const d = data[dIndex];

                        let optionSpan = document.createElement("span");
                        optionSpan.dataset.value = d[valueField];
                        optionSpan.innerHTML = d[textField];

                        sub.appendChild(optionSpan);

                    }

                });


            }

            if(data){
                data = JSON.parse(data);
                for (let index = 0; index < data.length; index++) {
                    let optionSpan = document.createElement("span");
                    optionSpan.dataset.value = data[index][valueField];
                    optionSpan.innerHTML = data[index][textField];
    
                    sub.appendChild(optionSpan);
    
                }
            }



            thisSelect.appendChild(title);

            if(data || url){
                thisSelect.appendChild(sub);
            }else{
                thisSelect.dataset.simple = true;
            }

            originalSelect.parentElement.appendChild(thisSelect)

        }

        setTimeout(function () {
            agogTextbox.addListeners();
        }, 2000);

    };

    agogTextbox.addListeners = function () {


        document.querySelectorAll("." + settings.mainClass).forEach(item => {
            item.addEventListener('mouseleave', function () { removeSelect(item) })
        })

        let titles = document.querySelectorAll("." + settings.titleClass + " span.inner");
        titles.forEach(title => {
            title.addEventListener('click', function () { showSub(title) })
        });

        let empties = document.querySelectorAll("." + settings.titleClass + " span." + settings.emptyClass);
        empties.forEach(empty => {
            empty.addEventListener('click', function () { emptySelect(empty) })
        });

        let selectableItems = document.querySelectorAll("." + settings.subClass + " span");
        selectableItems.forEach(selectableItem => {

            selectableItem.addEventListener('click', function (event) { selectOption(selectableItem, event) })

        })

        let textInputs = document.querySelectorAll(".form-item");
        textInputs.forEach(textInput => {

            let isSimple = textInput.parentNode.parentNode.parentNode.dataset.simple;

            if(!isSimple){
                let childItems = textInput.parentNode.parentNode.parentNode.children[1].querySelectorAll("span");
                textInput.addEventListener('keyup', function (event) { agogTextbox.itemsFilter(childItems, event) })
            }else{
                textInput.addEventListener('keyup', function (event) { 

                    let parent = textInput.parentNode.parentNode.parentNode;
                    let sIndex = parent.dataset.index;
                    let items = document.querySelectorAll(settings.selector);

                    items[sIndex].value = event.target.value;

                })
            }
        })


    };

    agogTextbox.removeListeners = function () {
        document.querySelectorAll("." + settings.mainClass).forEach(item => {
            item.removeEventListener('mouseleave', function () { removeSelect(item) });
        })

        let titles = document.querySelectorAll("." + settings.titleClass + " span.inner");
        titles.forEach(title => {
            title.removeEventListener('click', function () { showSub(title) })
        });

        let empties = document.querySelectorAll("." + settings.titleClass + " span." + settings.emptyClass);
        empties.forEach(empty => {
            empty.removeEventListener('click', function () { emptySelect(empty) })
        });

        let selectableItems = document.querySelectorAll("." + settings.subClass + " span");
        selectableItems.forEach(selectableItem => {
            selectableItem.removeEventListener('click', function (event) { selectOption(selectableItem, event) })
        })
    };


    agogTextbox.itemsFilter = function (elements, event) {

        event.target.parentNode.parentNode.parentNode.classList.add("active");

        elements = event.target.parentNode.parentNode.parentNode.children[1].children;

        if (event && event.keyCode === 13 && event.target.value.length > 0) {
            let firstItem = Array.from(elements).filter(function (x) { return x.innerHTML.toLocaleLowerCase().indexOf(event.target.value) > -1 });

            if (firstItem[0]){
                firstItem[0].click();
            }else{

                let optionSpan = document.createElement("span");
                optionSpan.dataset.value = event.target.value;
                optionSpan.innerHTML = event.target.value;

                optionSpan.addEventListener('click', function (event) { selectOption(optionSpan, event) })

                event.target.parentNode.parentNode.parentNode.children[1].appendChild(optionSpan);

                optionSpan.click();

            }

            event.target.value="";
        }

        for (let z = 0; z < elements.length; z++) {
            if (elements[z].tagName === "SPAN") {
                if (elements[z].innerText.toLocaleLowerCase().indexOf(event ? event.target.value : "") == -1) {
                    elements[z].style.display = "none";
                } else {
                    elements[z].style.display = "block";
                }
            }
        }
    }


    function removeSelect(item) {
        item.classList.remove("active");
    }

    function showSub(title) {
        let parent = title.parentNode.parentNode;
        parent.classList.toggle("active");
        if (parent.classList.contains("active")) {
            setTimeout(function () {
                title.querySelector(".form-item").focus();
            }, 200);
        }
    }

    function emptySelect(empty) {

        /* bu kısmı textbox'a göre güncelle */

        let parent = empty.parentNode.parentNode;
        let sIndex = parent.dataset.index;
        let items = document.querySelectorAll(settings.selector);
        let textBox = parent.children[0].querySelector(".form-item");

        textBox.placeholder=items[sIndex].getAttribute("aria-placeholder") || settings.placeholder; 

        parent.children[0].querySelector("span.inner").innerHTML="";
        parent.children[0].querySelector("span.inner").appendChild(textBox);

        parent.children[0].querySelector("span." + settings.emptyClass).style.display = "none";

        parent.removeAttribute("data-selected");

        items[sIndex].value="";

        let childItems = parent.dataset.optionGroup ? parent.children[1].querySelectorAll("." + settings.searchClass + ",span") : parent.children[1].children;

        for (let z = 0; z < childItems.length; z++) {
            childItems[z].classList.remove("active");
        }

    }

    function selectOption(selectableItem, event) {

        let parent = selectableItem.closest("." + settings.mainClass);
        let isMultiple = parent.dataset.multiple;
        let childItems = selectableItem.parentNode.querySelectorAll("span");
        let items = document.querySelectorAll(settings.selector);


        let sIndex = parent.dataset.index;

        if (!isMultiple) {
            let titleParent = parent.children[0].querySelector(".inner");
            let textBox = parent.children[0].querySelector("input");
            textBox.placeholder="...";
            titleParent.innerHTML = event.target.innerHTML;
            titleParent.appendChild(textBox);
            parent.dataset.selected = event.target.dataset.value;

            items[sIndex].value = event.target.dataset.value;

            parent.children[0].querySelector("span." + settings.emptyClass).style.display = "block";

            for (let z = 0; z < childItems.length; z++) {
                childItems[z].classList.remove("active");
            }

            event.target.classList.add("active");

        } else {

            if (settings.maxItems && parent.dataset.selected && parent.dataset.selected.split(settings.delimiter).length >= settings.maxItems) {
                return false;
            }

            let selectedItems = parent.dataset.selected ? parent.dataset.selected.split(settings.delimiter) : [];
            let selectedItemsText = [];

            if (selectedItems.indexOf(selectableItem.dataset.value) < 0) {
                selectedItems.push(selectableItem.dataset.value);
            }else{
                selectedItems = selectedItems.filter(function(item){
                    return item!=selectableItem.dataset.value
                })
            }

            for (let index = 0; index < selectedItems.length; index++) {
                selectedItemsText.push(selectableItem.parentNode.querySelector("[data-value='"+selectedItems[index]+"']").innerHTML);
            }


            let itemHtml = "";

            for (let k = 0; k < selectedItemsText.length; k++) {
                itemHtml = itemHtml + "<div class='agogTextbox-tag'>" + selectedItemsText[k] + "<div class='agogTextbox-tag-close' data-value='" + selectedItems[k] + "'><i class='fas fa-times'></i></div></div>";

            }

            let textBox = parent.children[0].querySelector(".form-item");

            if(selectedItemsText.length>0){
                textBox.placeholder="...";
            }else{
                textBox.placeholder=items[sIndex].getAttribute("aria-placeholder") || settings.placeholder; 
            }

            let inner = parent.children[0].querySelector("span");
            inner.innerHTML = itemHtml;
            inner.appendChild(textBox);
            parent.dataset.selected = selectedItems.join(settings.delimiter);
            items[sIndex].value = selectedItems.join(settings.delimiter);

            let tags = document.querySelectorAll(".agogTextbox-tag-close");

            for (let tIndex = 0; tIndex < tags.length; tIndex++) {
                const tag = tags[tIndex];

                tag.addEventListener('click', function (e) {
                    let tagId = e.target.dataset.value || e.target.parentNode.dataset.value;
                    document.querySelector("." + settings.subClass + " span[data-value='" + tagId + "']").click();
                    e.stopPropagation();
                })

            }

            event.target.classList.toggle("active");
        }
    }



    return agogTextbox;

});