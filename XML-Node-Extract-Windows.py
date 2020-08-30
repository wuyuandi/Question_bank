#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      gepe and randy Wu
#
# Created:     28-06-2020
# Copyright:   (c) gepe 2020
# Licence:     <your licence>
# using tips: python3 XML-Node-Extract-V4.py IDcalculusMoodle.xml
#-------------------------------------------------------------------------------
from lxml import etree
import os
import re
import sys
#import xml.etree.ElementTree as ET
TypeCategory = "category"
XMLSource = sys.argv[1]
NodeName = "question"
NodeAttrib = "type"


parser = etree.XMLParser(strip_cdata=False)
with open(XMLSource, "rb") as source:
    tree = etree.parse(source, parser=parser)

root = tree.getroot()

count = 0
for child in root.findall(NodeName):
    #print(child.tag, child.attrib)

    if child.get(NodeAttrib) == TypeCategory:
        textCategory = child[0].find("text").text
        #clean the path data
        textC = textCategory.replace('$cat1$/top/','')
        #find out the path where we at
        path = os.getcwd()+ '\\'+textC
        isExists = os.path.exists(path)
        if isExists:
            print('folder exists')
        else:

            os.mkdir(path)
            #print(textC+ ' folder created')
    else:
        questionType = child.get(NodeAttrib)
        Node = str(etree.tostring(child, encoding="UTF-8", method="xml")).replace("\\\\","\\")
        Node = Node[2:-1]
        line_list = Node.split('\\n')
        if child.find("idnumber").text != None:
            id = child.find("idnumber").text
            filename = str(id)+'-'+ str(questionType) + ".xml"
            filename1 = path + '\\'+filename
        else:
            count+=1
            filename = str("Fakeid"+ str(count))+'-'+ str(questionType) + ".xml"
            filename1 = path + '\\'+filename
            print('------------------------------------------------------------')
            print(filename1 + " is FakeID need to update")
            print('------------------------------------------------------------')
        if child.find("tags") is None:
            print('------------------------------------------------------------')
            print( filename1 +' is no tags')
            print('------------------------------------------------------------')
        try:
            with open(filename1,'w') as fp:
                fp.write('<?xml version="1.0" encoding="UTF-8"?>\n')
                for line in line_list:
                    fp.write(line+'\n')
            #print(filename+' file saved')
        except Exception as e:
            print('failure',e)