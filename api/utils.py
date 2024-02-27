from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def getTagScore(tags1, tags2):
    str1 = (" ".join(tags1)).split(' ')
    str2 = (" ".join(tags2)).split(' ')
    set1 = set([x for x in str1 if x not in ['beat','beats','type']])
    set2 = set([x for x in str2 if x not in ['beat','beats','type']])
    #print(set1, set2)
    return len(set1.intersection(set2)) / len(set1.union(set2))

def getSongAsDict(song):
    songDict = {}
    songDict["title"] = song.title
    songDict["genre"] = song.genre
    songDict["owner"] = song.owner_id
    songDict["description"] = song.description
    songDict["tags"] = [x for x in [song.tag1,song.tag2,song.tag3] if x!= None]
    return songDict


def getSongSimilarity(song1, song2):
    artist_multiplier = 30
    genre_multiplier = 20
    tag_multiplier = 14
    title_multiplier = 6
    description_multiplier = 4
    
    artistScore = [artist_multiplier if song1['owner'] == song2['owner'] else 0][0]
    genreScore = genre_multiplier * similar(song1['genre'], song2['genre'])
    tagScore = tag_multiplier * getTagScore(song1['tags'], song2['tags'])
    titleScore = title_multiplier * similar(song1["title"], song2["title"])
    descriptionScore = description_multiplier * similar(song1['description'], song2['description'])
    
    finalScore = (artistScore + genreScore + tagScore + titleScore + descriptionScore) / 74 # 74 is the sum of the multipliers (max Score)
    print(song1["title"], artistScore, genreScore, tagScore, titleScore,descriptionScore)
    
    return finalScore