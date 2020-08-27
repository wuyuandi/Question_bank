#-------------------------------------------------------------------------------
# Name:        
# Purpose:  go through each file and get the xml file name and 
#           get the xmml data to become json
# Author:      randy Wu
#
# Created:     28-06-2020
# Copyright:   (c) gepe 2020
# Licence:     <your licence>
# using tips: run $ python3 loopFile.py Calculus
#-------------------------------------------------------------------------------
import os
import json
import xmltodict 
import sys
import json
from lxml import etree
import re

path = "./" + sys.argv[1]

#loop the folder to get every xml file in the root folder e.g. (Calculus)
def get_fileList(dir):
    FileList = []
    for home,dirs,files in os.walk(path):
        for filename in files:
            if filename != ".DS_Store":
                FileList.append(os.path.join(home, filename))

    return FileList

def xmltojson(xml_path):
    xml_file = open(xml_path,'r')
    xml_str = xml_file.read()
    xmlparse = xmltodict.parse(xml_str)
    #print(xmlparse['question']['idnumber'])

    jsonstr = json.dumps(xmlparse,indent=4)
    #jsondict = json.loads(jsonstr)

    # fp = open('data.json', 'w+')
    # json1 = json.dump(jsondict, fp)
    # with  open('data.json', 'a+') as fp:
    # #     print(type(jsonstr))
    #     fp.write('['+ '\n')
    #     fp.write(jsonstr+'\n')
    #print(jsonstr)
    return jsonstr

## clean the every single xml file to only include name, text,id, tags and answer
def cleanxml(xml_path):
    parser = etree.XMLParser(strip_cdata=False)
    with open(xml_path, "rb") as source:
        tree = etree.parse(source, parser=parser)

    root = tree.getroot()

    tags = ['name','questiontext','idnumber','answer','tags']
    for child in root:
        if child.tag not in tags:
            root.remove(child)
        tree.write(xml_path)

FileList = get_fileList(path)
with  open('./src/data.json', 'w+') as fp:
    fp.write('['+ '\n')

    for file in FileList:
        cleanxml(file)
        fp.write('    ' + xmltojson(file))
        if file != FileList[-1]:
            fp.write(',')
    #print(file)
    fp.write(']'+ '\n')
print('--------------------------------------')
print("Total xml File count:" + str(len(FileList)))

Source = "./src/data.json"


with open(Source, 'rb') as f:
    Json_data = json.load(f)
tagDict={}

#list
#print(Json_data[0]["question"]["tags"]["tag"])
count = 0
tagsCount = 0
for data in Json_data:
    try:
        for item in data["question"]["tags"]["tag"]:
            #print(item['text'])
            if item['text'] not in tagDict:
                tagDict[item['text']] = []
                tagDict[item['text']].append(data["question"]["idnumber"])
            else:
                tagDict[item['text']].append(data["question"]["idnumber"])
    except Exception as e:
            print('failure-----'+ data["question"]["idnumber"],e)
# print(count)
# print(tagsCount)
#print(tagDict)
json_str = json.dumps(tagDict,indent=4)
with open('./src/tagData.json', 'w+') as fp:
    fp.write(json_str)


def xmltojsonV2(xml_path):
    xml_file = open(xml_path,'r')
    xml_str = xml_file.read()
    xmlparse = xmltodict.parse(xml_str)
  
    #print(xmlparse['question']['idnumber'])

    jsonstr = json.dumps({xmlparse['question']['idnumber']:xmlparse},indent=4)
    
    #jsondict = json.loads(jsonstr)

    # fp = open('data.json', 'w+')
    # json1 = json.dump(jsondict, fp)
    # with  open('data.json', 'a+') as fp:
    # #     print(type(jsonstr))
    #     fp.write('['+ '\n')
    #     fp.write(jsonstr+'\n')
    #print(jsonstr)
    return jsonstr[1:-1]

with  open('./src/data.json', 'w+') as fp:
    fp.write('{'+ '\n')

    for file in FileList:
        cleanxml(file)
        fp.write('    ' + xmltojsonV2(file))
        if file != FileList[-1]:
            fp.write(',')
    #print(file)
    fp.write('}'+ '\n')