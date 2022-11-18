const faker = require('faker')
const get = require('lodash/get')

class MockedAddressServiceClient {

    constructor (existingItem) {
        this.existingItem = existingItem
    }

    /**
     * This method returns mocked data in dadata format
     * @param s
     * @param params
     * @returns {Promise<Array<{addressSource, address, addressKey: *, addressMeta: {data: {area: null, country: string, city: string, street: string, block: string, region: string, building: string, settlement: null}, provider: {name: string, rawData: {data: {country: string, flat_fias_id: null, settlement_type_full: null, city_district_fias_id: null, block_type: string, settlement_fias_id: null, city_district_kladr_id: null, region_type: string, source: null, area_type_full: null, okato: string, divisions: null, geoname_id: *, house_fias_id: string, fias_id: *, street_with_type: string, area_kladr_id: null, federal_district: string, qc: null, region_type_full: string, beltway_hit: null, geo_lon: string, square_meter_price: null, block: string, region_fias_id: string, block_type_full: string, stead_type: null, entrance: null, city_district: string, city_type: string, area: null, area_fias_id: null, house_cadnum: null, flat_type: null, settlement_kladr_id: null, settlement_with_type: null, area_with_type: null, fias_actuality_state: string, fias_level: string, area_type: null, beltway_distance: null, country_iso_code: string, fias_code: null, city_fias_id: string, metro: null, kladr_id: string, tax_office: string, postal_box: null, house_kladr_id: string, region: string, settlement_type: null, flat_price: null, qc_complete: null, qc_house: null, stead_fias_id: null, city: string, timezone: null, flat_area: null, stead_cadnum: null, house: string, stead: null, settlement: null, region_iso_code: string, capital_marker: string, region_kladr_id: string, flat: null, street: string, qc_geo: string, house_type: string, floor: null, city_district_with_type: string, city_kladr_id: string, city_area: null, city_type_full: string, street_kladr_id: string, stead_type_full: null, flat_type_full: null, flat_cadnum: null, house_type_full: string, oktmo: string, geo_lat: string, city_district_type: string, history_values: null, street_type_full: string, city_district_type_full: string, tax_office_legal: string, street_type: string, region_with_type: string, postal_code: string, city_with_type: string, unparsed_parts: null, street_fias_id: string}, unrestricted_value: string, value: string}}}}>>}
     */
    async search (s, params = {}) {
        const item = this.existingItem
        return [{
            addressSource: s,
            address: get(item, 'address', s),
            addressKey: get(item, 'addressKey', faker.random.alphaNumeric(32)),
            addressMeta: {
                data: {
                    area: null,
                    city: 'г Самара',
                    block: 'корпус 1',
                    region: 'Самарская обл',
                    street: 'ул Ново-Садовая',
                    country: 'Россия',
                    building: 'дом 106г',
                    settlement: null,
                },
                provider: {
                    name: 'dadata',
                    rawData: get(
                        item,
                        'addressMeta',
                        {
                            dv: 1,
                            address: 'г Самара, ул Ново-Садовая, д 106г к 1',
                            data: {
                                qc: null,
                                area: null,
                                city: 'Самара',
                                flat: null,
                                block: '1',
                                floor: null,
                                house: '106г',
                                metro: null,
                                okato: '36401385000',
                                oktmo: '36701330',
                                stead: null,
                                qc_geo: '0',
                                region: 'Самарская',
                                source: null,
                                street: 'Ново-Садовая',
                                country: 'Россия',
                                fias_id: '4e232277-2670-427b-bef7-86a8922a2c81',
                                geo_lat: '53.216211',
                                geo_lon: '50.145792',
                                entrance: null,
                                kladr_id: '6300000100007730181',
                                qc_house: null,
                                timezone: null,
                                area_type: null,
                                city_area: null,
                                city_type: 'г',
                                divisions: null,
                                fias_code: null,
                                flat_area: null,
                                flat_type: null,
                                block_type: 'к',
                                fias_level: '8',
                                flat_price: null,
                                geoname_id: 99330,
                                house_type: 'д',
                                postal_box: null,
                                settlement: null,
                                stead_type: null,
                                tax_office: '6316',
                                beltway_hit: null,
                                flat_cadnum: null,
                                postal_code: '443068',
                                qc_complete: null,
                                region_type: 'обл',
                                street_type: 'ул',
                                area_fias_id: null,
                                city_fias_id: 'bb035cc3-1dc2-4627-9d25-a1bf2d4b936b',
                                flat_fias_id: null,
                                house_cadnum: null,
                                stead_cadnum: null,
                                area_kladr_id: null,
                                city_district: 'Октябрьский',
                                city_kladr_id: '6300000100000',
                                house_fias_id: '7c174eb5-e5d7-4532-9ba1-9fcf9148be9b',
                                stead_fias_id: null,
                                area_type_full: null,
                                area_with_type: null,
                                capital_marker: '2',
                                city_type_full: 'город',
                                city_with_type: 'г Самара',
                                flat_type_full: null,
                                history_values: null,
                                house_kladr_id: '6300000100007730181',
                                region_fias_id: 'df3d7359-afa9-4aaa-8ff9-197e73906b1c',
                                street_fias_id: 'ca0fd9f7-225a-49ad-90fa-66153c3704bf',
                                unparsed_parts: null,
                                block_type_full: 'корпус',
                                house_type_full: 'дом',
                                region_iso_code: 'RU-SAM',
                                region_kladr_id: '6300000000000',
                                settlement_type: null,
                                stead_type_full: null,
                                street_kladr_id: '63000001000077300',
                                beltway_distance: null,
                                country_iso_code: 'RU',
                                federal_district: 'Приволжский',
                                region_type_full: 'область',
                                region_with_type: 'Самарская обл',
                                street_type_full: 'улица',
                                street_with_type: 'ул Ново-Садовая',
                                tax_office_legal: '6316',
                                city_district_type: 'р-н',
                                settlement_fias_id: null,
                                square_meter_price: null,
                                settlement_kladr_id: null,
                                fias_actuality_state: '0',
                                settlement_type_full: null,
                                settlement_with_type: null,
                                city_district_fias_id: null,
                                city_district_kladr_id: null,
                                city_district_type_full: 'район',
                                city_district_with_type: 'Октябрьский р-н',
                            },
                            value: 'г Самара, ул Ново-Садовая, д 106г к 1',
                            unrestricted_value: '443068, Самарская обл, г Самара, Октябрьский р-н, ул Ново-Садовая, д 106г к 1',
                        },
                    ),
                },
            },
        }]
    }

    async suggest (s, params) {
        throw new Error('If you really need in this method, realize it! :)')
    }

    async add (data) {
        throw new Error('This method shouldn\'t be called during tests')
    }
}

module.exports = { MockedAddressServiceClient }