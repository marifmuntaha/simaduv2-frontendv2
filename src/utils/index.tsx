export const slideUp = (target, duration=500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight; target.style.overflow = 'hidden'; target.style.height = 0;
    target.style.paddingTop = 0; target.style.paddingBottom = 0;
    target.style.marginTop = 0; target.style.marginBottom = 0;
    window.setTimeout( () => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
    }, duration);
}

export const slideDown = (target, duration=500) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none') display = 'block';
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden'; target.style.height = 0; target.style.paddingTop = 0;
    target.style.paddingBottom = 0; target.style.marginTop = 0;
    target.style.marginBottom = 0; target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top'); target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top'); target.style.removeProperty('margin-bottom');
    window.setTimeout( () => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
    }, duration);
}

export const getParents = (el, selector, filter) => {
    // If no selector defined will bubble up all the way to *document*
    let parentSelector = (selector === undefined) ? document : document.querySelector(selector);
    let parents = [];
    let pNode = el.parentNode;

    while (pNode !== parentSelector) {
        let element = pNode;

        if(filter === undefined){
            parents.push(element); // Push that parentSelector you wanted to stop at
        }else{
            element.classList.contains(filter) && parents.push(element);
        }
        pNode = element.parentNode;
    }

    return parents;
}

export const role = (roleId) => {
    switch (roleId) {
        case '1':
            return "Administrator";
        case '2':
            return "Operator Madrasah";
        case '3':
            return "Bendahara"
        case '4':
            return "Teller"
        case '5':
            return "Siswa"
        default:
            return "Pengunjung"
    }
}

export const calcPercentage = (str1, str2) => {
    let result = Number(str2) / Number(str1);
    result = result * 100;
    return Math.floor(result);
};

export const findUpper = (string) => {
    let extractedString = [];

    for (let i = 0; i < string.length; i++) {
        if (string.charAt(i) === string.charAt(i).toUpperCase() && string.charAt(i) !== " ") {
            extractedString.push(string.charAt(i));
        }
    }
    if (extractedString.length > 1) {
        return extractedString[0] + extractedString[1];
    } else {
        return extractedString[0];
    }
};

export const generateSecureToken = (length = 32) => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const zeroPad = (num, places) => {
    let zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export const numberFormat = (number) => {
    const nf = new Intl.NumberFormat('id-ID');
    return nf.format(String(number).replace(/\./g, ""));
}

export const monthOptions = [
    {value: '1', label: "Januari"},
    {value: '2', label: "Februari"},
    {value: '3', label: "Maret"},
    {value: '4', label: "April"},
    {value: '5', label: "Mei"},
    {value: '6', label: "Juni"},
    {value: '7', label: "Juli"},
    {value: '8', label: "Agustus"},
    {value: '9', label: "September"},
    {value: '10', label: "Oktober"},
    {value: '11', label: "Nopember"},
    {value: '12', label: "Desember"},

]