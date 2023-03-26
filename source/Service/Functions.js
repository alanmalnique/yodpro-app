export default class Functions {
    static dataHora2Brasileiro(date) {
        let dataSeparate = date.split(' ');
        let data = dataSeparate[0].split('-');
        let hora = dataSeparate[1].split(':');
        return data[2] + "/" + data[1] + "/" + data[0] + ' ' + hora[0] + ':' + hora[1];
    }
}