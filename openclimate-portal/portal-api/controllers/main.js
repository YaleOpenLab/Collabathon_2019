


const getEmissionsPledgesForCountry = (req, res, db) => {
    let countryName = req.query.countryName;
    console.log('Country Name: ' + countryName);

    db.select('*').from('country')
        .whereRaw('cld_rdisplayname = ?', [countryName])
        .then(items => {

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
        .orderBy('year', 'asc')
        .orderBy('value', 'asc')
        .then(items => {

               let combined = [{}];
              combined[0].total_emissions = passedResult.total_emissions;

            let value1 = '';
            let value2 = '';
            let label = '';
            let year = '';

            let newitems = []

            let n = 0;

            let i = 0;

            let rangepledge = {};

            items.map(pledge => {

              if (pledge.range == 'Yes') {

                  console.log('Pledge yes: '+JSON.stringify(pledge));
                  year = pledge['year'];

                  console.log('Year: '+year);

                  if (i == 0) {
                      value1 = pledge['value'];
                  } else {
                      value2 = pledge['value'];
                  }

                  label = pledge['label'];

                  rangepledge['iso'] = pledge.iso;
                  rangepledge['country'] = pledge.country;
                  rangepledge['label'] = label;
                  rangepledge['year'] = year;


                  if (i == 1) {
                      rangepledge['value'] = value1 + ' - '+value2;
                      console.log('Range pledge: '+JSON.stringify(rangepledge));



                      newitems[n] = rangepledge;
                      n++;


                      console.log('N SET TO: '+n + ' : '+JSON.stringify(rangepledge));

                      rangepledge = {};
                      i = 0;
                  } else {
                      i++;
                  }

              } else {
                  console.log('N SET TO: '+n + ' : '+JSON.stringify(pledge));

                  newitems[n] = pledge;
                  n++;

              }


            })




            combined[0].total_pledges = newitems;

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
    console.log('Get countries');
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
