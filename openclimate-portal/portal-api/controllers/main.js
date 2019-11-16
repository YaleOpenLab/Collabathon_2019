const getTableData = (req, res, db) => {
  db.select('*').from('testtable1')
    .then(items => {
      if(items.length){
        res.json(items)
      } else {
        res.json({dataExists: 'false'})
      }
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}


const getEmissionsPledgesForCountry = (req, res, db) => {
    let countryName = req.query.countryName;
    console.log('Country Name: ' + countryName);

    db.select('*').from('country')
        .whereRaw('cld_rdisplayname = ?', [countryName])
        .then(theseitems => {
            console.log('Hi there wtf');
           // console.log('Results: ' + JSON.stringify(theseitems));
                   // res.json({dataExists: 'false'});

                    console.log('It had something: '+console.log(theseitems));


                   // getEmissionSumForCountry(req,res,db,theseitems[0].is_o3166_1__alpha_3);


        })
        .catch(err => console.log('Error'));
}

const getEmissionSumForCountry = (req, res, db, country_code) => {

    let countryCode = 'xxxx';

    if (countryName == 'United States') {
        countryCode = 'USA';
    }

    db.select(db.raw('SUM(latest_reported_value) AS total_emissions')).
    from('primap_hist_v2_0_11_dec_2018_csv')
        .whereRaw('scenario=\'HISTCR\' AND entity=\'KYOTOGHGAR4\' AND (category = \'IPC1\' OR category = \'IPC2\' OR category = \'IPC4\' OR category = \'IPCC5\' OR category = \'IPCMAG\' OR category = \'IPC3A\' OR category = \'MAdGELV\') AND country = ?', [countryCode])
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
                        finishEmissionsPledgesForCountry(req, res, db, countryCode, queryResult);
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

function finishEmissionsPledgesForCountry  (req, res, db, countryName, passedResult)  {
    let returnResult = []

    db.select('*').
    from('cw_ndc_quantification_csv')
        .whereRaw('label != \'BAU\' AND iso = ?', [countryName])
        .then(items => {
            console.log('Items: '+JSON.stringify(items));
            if(items.length > 0){
                console.log('Items length: '+items.length);
                //res.json(items[0])
                this.returnResult = items;
                console.log('Result so far: '+JSON.stringify(this.returnResult));

                let combined = [{}];
                combined[0].total_emissions = passedResult.total_emissions;
                combined[0].total_pledges = this.returnResult;

                console.log('Combined here: '+JSON.stringify(combined));
                res.json(combined);


            } else {
               // res.json({dataExists: 'false'})
            }
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

const postTableData = (req, res, db) => {
  const { first, last, email, phone, location, hobby } = req.body
  const added = new Date()
  db('testtable1').insert({first, last, email, phone, location, hobby, added})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

const putTableData = (req, res, db) => {
  const { id, first, last, email, phone, location, hobby } = req.body
  db('testtable1').where({id}).update({first, last, email, phone, location, hobby})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

const deleteTableData = (req, res, db) => {
  const { id } = req.body
  db('testtable1').where({id}).del()
    .then(() => {
      res.json({delete: 'true'})
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

module.exports = {
    getCountries,
    getCities,
    getEmissions,
    getEmissionsPledgesForCountry,
    getTableData,
    postTableData,
    putTableData,
    deleteTableData
}
