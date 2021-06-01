from django import http
from django.http import JsonResponse
from django.shortcuts import render,HttpResponse
from rest_framework.response import Response 
from rest_framework.decorators import api_view

#scrap
def get_html_content(wikiURL):
    import requests
    session = requests.Session()
    htmlcontent = session.get(wikiURL).text

    return htmlcontent

@api_view(['GET'])
def frequentWords(request):
    wikiURL = request.query_params.get('wikiLink')
    html_content = get_html_content(wikiURL)

    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html_content,'html.parser')
    
    confirmationLine = soup.find('td',attrs={'class':'mbox-text'})
    if(confirmationLine != None):
        b_tag = confirmationLine.find('b',string="Wikipedia does not have an article with this exact name.")
        print("b_tag:",b_tag)
        if(b_tag != None):
            b_tag_text = b_tag.text
            if(b_tag_text == "Wikipedia does not have an article with this exact name."):
                return JsonResponse({'heading':'','htmlContent':'','wrongURL':True})

    heading = soup.find('h1',attrs={'id':'firstHeading'}).text
    region = soup.find('div',attrs={'class':'mw-parser-output'})
    p_region = region.find_all('p')
    
    para = ''
    for p in p_region:
        para = para+p.text
        
    para = para.lower()
    
    import re 
    clean_para = ''
    for k in para.split("\n"):
        clean_para += re.sub(r"[^a-zA-Z0-9]+", ' ', k)
    all_words = clean_para.split(' ')
    
    map = {} 
    for i in all_words:
        if(map.get(i) != None and map.get(i) != ' '):
            map[i] += 1
        elif(map.get(i) == None):
            map.update({i:1})

    sorted_values = sorted(map.values(),reverse=True)
    sorted_dict = {}

    for i in sorted_values:
        for k in map.keys():
            if map[k] == i:
                sorted_dict[k] = map[k]
                break

    import itertools 
    top_ten = dict(itertools.islice(sorted_dict.items(), 10)) 

    import numpy as np 
    result = top_ten.items() 
    data = list(result)

    return JsonResponse({'heading':heading,'htmlContent':data})
    
