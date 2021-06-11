function downloadCSV(args) {
    var array = typeof args.data != 'object' ? JSON.parse(args.data) : args.data;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    filename = args.filename || 'export.csv';
    csv = 'data:text/csv;charset=utf-8,' + str;
    data = encodeURI(csv);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();


    return str;
}