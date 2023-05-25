export const csvmaker = function (data) {
    const csvRows = [];
    const values = Object.values(data).join('; ');
    csvRows.push(values)
    return csvRows.join('\n')
}    