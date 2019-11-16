


const getEmissionsPledgesForCountry = (req, res, db) => {
    let countryName = req.query.countryName;
    console.log('Country Name: ' + countryName);

    db.select('*').from('country')
        .whereRaw('cld_rdisplayname = ?', [countryName])
        .then(items => {
            console.log('Hi there wtf');
           // console.log('Results: ' + JSON.stringify(theseitems));
                   // res.json({dataExists: 'false'});

                    console.log('It had something: '+JSON.stringify(items[0]['is_o3166_1__alpha_3']));

                    getEmissionSumForCountry(req,res,db,items[0]['is_o3166_1__alpha_3']);


        })
        .catch(err => console.log('Error'));
}

const getEmissionSumForCountry = (req, res, db, country_code) => {

    console.log('Do it: '+JSON.stringify(country_code));
    db.select(db.raw('SUM(latest_reported_value) AS total_emissions')).
    from('primap_hist_v2_0_11_dec_2018_csv')
        .whereRaw('scenario=\'HISTCR\' AND entity=\'KYOTOGHGAR4\' AND (category = \'IPC1\' OR category = \'IPC2\' OR category = \'IPC4\' OR category = \'IPCC5\' OR category = \'IPCMAG\' OR category = \'IPC3A\' OR category = \'MAdGELV\') AND country = ?', [country_code])
        .then(items => {
            console.log('items: '+JSON.stringify(items));

                if(items[0]) {
                    //res.json(items[0])
                    //this.returnResult = items[0];
                    let queryResult = items[0];
                    console.log('RESULT HERE: '+JSON.stringify(queryResult.total_emissions));
                    let queryDivided = Number(queryResult.total_emissions / 1000);

                    queryDivided = numberWithCommas(queryDivided);

                    queryResult.total_emissions = queryDivided;
                    if (queryDivided != 0) {
                        finishEmissionsPledgesForCountry(req, res, db, country_code, queryResult);
                    } else {
                        res.json({dataExists: 'false'})

                    }

            } else {
                //res.json({dataExists: 'false'})
            }
        })
        .catch(err => console.log('Error here: '+JSON.stringify(err)));



}

function numberWithCommas(nStr) {

        return nStr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

function finishEmissionsPledgesForCountry  (req, res, db, country_code, passedResult)  {
    let returnResult = []

    db.select('*').
    from('cw_ndc_quantification_csv')
        .whereRaw('label != \'BAU\' AND iso = ?', [country_code])
        .then(items => {

               let combined = [{}];
              combined[0].total_emissions = passedResult.total_emissions;
              combined[0].total_pledges = items;

               console.log('Combined here: '+JSON.stringify(combined));
                res.json(combined);


        })
        .catch(err => console.log('Error finishing: '+JSON.stringify(err)))


}


const getEmissions = (req, res, db) => {

    console.log('selecting')

    db.select('*').from('emission')
        .orderBy('emissionid', 'desc')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))

}



const getCountries = (req, res, db) => {
    db.select('cld_rdisplayname').from('country').orderBy('cld_rdisplayname', 'asc')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}


const getCities = (req, res, db) => {
    db.select('organization_name','country_name').from('city').orderBy('organization_name', 'asc')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

module.exports = {
    getCountries,
    getCities,
    getEmissions,
    getEmissionsPledgesForCountry
}
