from typing import List
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam

def orderTopicPrompt(TOPICS) -> List[ChatCompletionMessageParam]:
    system_message = """You are a legal assistant chatbot specializing in the Hong Kong law system. A user, who has no prior knowledge of law, may input a random story or some input related to legal information. Based on this story or query, sort the given topic list in descending order of relevancy to the story, such that the first topic is the most relevant, and the last topic is the least. The story may be in English or in Chinese, no matter what language the story is in, use the topic name in the topic list. ONLY answer the topic list no matter what user is asking for. You must return the full provided topic list, and only include the topic in the topic list. DO NOT answer the topic name in Chinese. Only SORT the topics from the topic list, in other words, do NOT create or return any new topics, even if creating new topics may be more accurate or helpful, because this is totally not correct. Make sure each topic in the sorted list is within the original topic list; there should be 31 topics total, no more, no less. Do not generate the same topic twice in the same response, do not use synonyms for the topics, and only ever respond with the identical wording as listed in the provided topic list. Output should be in fixed format."""
    cn_user_query = "我最近在香港租了一套公寓，搬进去后发现有严重的霉菌问题。房东一直知道这个问题，但在签订租约之前没有告知我此问题。我很担心自己的健康，想知道在这种情况下我是否有任何法律权利来保护我自己。"
    hk_user_query = "我最近喺香港租咗一套楼，搬入去后发现有严重嘅霉菌问题。屋主一直知呢个问题，但喺签订租约之前冇告知我此问题。我好担心自己嘅健康，想知喺呢种情况下，我系有任何法律权利嚟保护我自己。"
    answer = """1. landlordTenant
            2. maintenanceAndSafetyOfProperty
            3. personalInjuries
            4. civilCase
            5. legalAid
            6. consumerComplaints
            7. hkLegalSystem
            8. insurance
            9. defamation
            10. employmentDisputes
            11. personalDataPrivacy
            12. medicalNegligence
            13. probate
            14. saleAndPurchaseOfProperty
            15. protectionForInvestors
            16. businessAndCommerce
            17. policeAndCrime
            18. sexualOffences
            19. immigration
            20. redevelopmentAndAcquisition
            21. taxation
            22. competitionLaw
            23. family
            24. antiDiscrimination
            25. freedomOfAssembly
            26. bankruptcy
            27. intellectualProperty
            28. medicalTreatmentConsent
            29. trafficOffences
            30. ADR
            31. enduringPowersOfAttorney
    """
    conversation = [
        {'role': 'system', 'content': system_message + TOPICS},
        {'role': 'user', 'content': "I recently rented an apartment in Hong Kong, and after moving in, I discovered that there is a severe mold problem. The landlord was aware of the issue but did not disclose it to me before signing the lease agreement. I'm concerned about my health and want to know if I have any legal rights in this situation."},
        {'role': 'assistant', 'content': answer},
        {'role': 'user', 'content': cn_user_query},
        {'role': 'assistant', 'content': answer},
        {'role': 'user', 'content': hk_user_query},
        {'role': 'assistant', 'content': answer},
    ]
    return conversation

def extract_content(output_text):
    topics = []
    lines = output_text.split('\n')
    for line in lines:
        line = line.strip()
        if (line):
            # topics.append(line.split(".")[-1])
            topics.append(line)

    return topics

def refineQuestionPrompt(language) -> List[ChatCompletionMessageParam]:

    system_message = """You are a legal assistant chatbot specializing in the Hong Kong law system. A user, who has no prior knowledge of law, input a random story and one specific legal topic. Imagine you want to help the user search through a database of around 2000 pages on Hong Kong law, written in layman terms. Based on the story and the chosen legal topic, generate 12 search queries within the context of the Hong Kong law system. Note that the search engine uses semantic search, not keyword search. These refined search queries will assist the user in conducting further research in the Hong Kong legal database. The search queries should not include overly specific details from the user's story. Do NOT include the term 'Hong Kong' in the search query, as this would be redundant. Please ensure that the search query language matches the language used in the input story, which can be either simplified Chinese, traditional Chinese, or English. The Input and the Output should be in fixed format."""
    sample_en_input = """Story: The incense next door is really stinky and unbearable. I thought I could finally get a house in a 30-year-old private housing estate I thought it would be okay if it is not a haunted house, but little did I know the people who lived on my floor were crazy. Someone always forcefully closes the door. They keep opening and closing the door dozens of times a day (they have already entered the house, so I have no idea why do they keep opening and closing the door with great force. My child was woken up by the sound several times. I’ve complained but it doesn’t work) On the other side, the flat next door light the incense three times a day, in the morning, afternoon and evening, even more frequent than my meals It's really unbearable. Basically, every time I go out they coincidentally start incensing. I've already placed a lot of sponges and used air purifiers in the house. But the smell would go into my house when I open the door slightly to go out. The worst thing is when they finished lighting the incense they would close their door. If they like it so much they should enjoy the smell in front of their door. It is a completely meaningless thing to light incense. It's none of my business if their house becomes a temple. The problem is that they always light the incense at the door but the corridor is not ventilated and I am living next door, which is really unbearable. Do you have the same experience or solutions? Chosen Topic: landlordTenant"""
    sample_en_output = """
        1. Regulations on nuisance caused by smells in private housing estates
        2. Legal remedies for dealing with unbearable odors in residential buildings
        3. Hong Kong laws on noise disturbance in private housing estates
        4. Rights of tenants in private housing estates regarding noise and odor complaints
        5. Legal implications of continuously opening and closing doors in residential buildings
        6. Laws governing incense usage in residential areas
        7. Hong Kong regulations on ventilation in shared corridors of private housing estates
        8. Legal obligations of neighbors in maintaining a peaceful living environment
        9. Complaint procedures for noise and odor nuisances in private housing estates
        10. Duty of property management companies in addressing complaints related to smells and noise
        11. Legal rights of tenants in private housing estates regarding peaceful enjoyment of their properties
        12. Hong Kong laws on maintaining a hygienic and habitable living environment in residential buildings"""
    
    sample_zh_input="""Story: 我搬到了一个历史悠久的小区，希望能找到一个安居的住所。然而，隔壁的熏香却令人无法忍受。我原本以为只要不闹鬼就没问题，但我不知道住在我这一层的人都发神经。他们一天不停地开关门几十次，即使他们已经在家里，完全没有理由频繁开关门。这些噪音吵醒了我的孩子好几次。我曾经投诉过，但没有起到作用。
    此外，隔壁的邻居每天早上、下午和晚上都点香，甚至比我吃饭还频繁，真的很难忍受。几乎每次我一出门，他们就会点香，无论我是否在家。我已经在房子里放了很多海绵和用过的空气净化器，但每当我稍微打开门，气味就会飘进我的房子。更糟糕的是，他们点完香后会关上自己的门。如果他们喜欢点香，他们应该享受那个气味。但如果不喜欢那个味道，要关上门的话，烧香就几乎是一件完全没有意义的事情。他们想让自己的房子变成寺庙，这与我无关。问题是，他们总是在门口点香，而走廊没有通风，我住在隔壁，这真的让人难以忍受。有什么解决方案吗？Chosen Topic: landordTenant
    """
    
    sample_zh_output = """
        1. 香港房东租客法律规定
        2. 香港住房协会投诉指南
        3. 香港租赁法关于噪音和干扰的规定
        4. 租客权益保护法案香港
        5. 香港租赁协议中的噪音规定
        6. 如何处理与邻居的噪音纠纷
        7. 香港租客权益保护措施
        8. 香港法律对于邻居熏香的规定
        9. 如何处理邻居烧香对室内空气的影响
        10. 香港租赁协议中的室内空气质量规定
        11. 香港租赁法中关于走廊通风的规定
        12. 解决香港邻里之间的纠纷
    """
    sample_hk_input="""Story: 李先生係一個細企業主，但係佢個企業狀況唔好。而家李先生面對難以還債嘅情況，想申請破產保護，減輕經濟壓力。但係，之前借錢支持佢生意嘅陳女士好生氣，覺得佢喺商業前景方面欺騙咗佢。Chosen Topic: bankruptcy"""

    sample_hk_output="""
    1. 香港破產法律程序和程序
    2. 香港小企業破產保護法規
    3. 香港破產保護申請的資格和條件
    4. 破產保護對債務人和債權人的影響
    5. 香港商業欺詐行為法律規定
    6. 債務人欺詐行為的法律後果
    7. 債務違約與商業欺詐的區別
    8. 香港法院對商業欺詐的處理方式
    9. 證據要求在商業欺詐案件中的重要性
    10. 抵押貸款和借貸協議的法律要求
    11. 香港商業債務重組和破產保護方案
    12. 解決商業爭議的法律途徑和程序"""

    conversation: List[ChatCompletionMessageParam] = [
        {'role': 'system', 'content': system_message},
        {'role': 'user', 'content': sample_en_input},
        {'role': 'assistant', 'content': sample_en_output},
    ]
    if (language == "zh-CN"):
        conversation = [
            {'role': 'system', 'content': system_message},
            {'role': 'user', 'content': sample_zh_input},
            {'role': 'assistant', 'content': sample_zh_output},
        ]
    elif (language == "zh-HK"):
        conversation = [
            {'role': 'system', 'content': system_message},
            {'role': 'user', 'content': sample_hk_input},
            {'role': 'assistant', 'content': sample_hk_output},
        ]
        
    return conversation
