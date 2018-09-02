# import 

from flask import Flask, render_template, jsonify, redirect

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


app = Flask(__name__)



engine = create_engine("sqlite:///belly_button_biodiversity.sqlite", echo=False)
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()
OTU = Base.classes.otu
Samples = Base.classes.samples
SamplesMetadata = Base.classes.samples_metadata
session = Session(engine)

# render index.html
@app.route("/")
def default():

    sample_list_v = names()
    print(sample_list_v)

    return render_template("index.html")

# list of sample names 
@app.route("/names", methods=['POST','GET'])
def names():

    samples_cols_list = Base.classes.samples.__table__.columns.keys()
    return jsonify(samples_cols_list[1:])

# otu_id's
@app.route("/otu", methods=['POST','GET'])
def otu():

    otu_desc = session.query(OTU.lowest_taxonomic_unit_found).all()
    otu_descriptions = [i[0] for i in otu_desc]
    return jsonify(otu_descriptions)

# metadata for a specific sample
@app.route('/metadata/<sample>', methods=['POST','GET'])
def metadata(sample):

    results = session.query(SamplesMetadata).filter(SamplesMetadata.SAMPLEID == sample[3:]).all()
    dict1 = {}
    for k,v in results[0].__dict__.items():
        if ('AGE' in k or 'BBTYPE' in k or 'ETHNICITY' in k or 'GENDER' in k or 'LOCATION' in k or 'SAMPLEID' in k):
            dict1[k] = v

    return jsonify(dict1)
    

@app.route('/wfreq/<sample>', methods=['POST','GET'])
def wfreq(sample):

    results = session.query(SamplesMetadata.WFREQ).filter(SamplesMetadata.SAMPLEID == sample[3:]).all()
    
    return jsonify(results[0][0])

# for a specific sample
@app.route('/samples/<sample>', methods=['POST','GET'])
def samples(sample):

    results = session.query(Samples.otu_id,getattr(Samples, sample)).order_by(getattr(Samples, sample).desc()).all()
    results
    dict1 = {}
    list1 = []
    list2 = []
    list3 = []
    for x in results:
        if(x[1] > 0):
            list1.append(x[0])
            list2.append(x[1])
    dict1['otu_id'] = list1
    dict1['sample_values'] = list2
    list3.append(dict1)
    list3

    return jsonify(list3)


# Initiate
if __name__ == '__main__':
    app.run(debug=True)