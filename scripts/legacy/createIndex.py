from azure.core.credentials import AzureKeyCredential
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import *
import os

# Initialize the Azure Search client
endpoint = f"https://{os.environ.get('AZURE_SEARCH_SERVICE')}.search.windows.net/"
LANG = 'tc'
index_name = "clic-index-"+LANG
api_key = os.environ.get("AZURE_SEARCH_KEY")

credential = AzureKeyCredential(api_key)
client = SearchIndexClient(endpoint=endpoint, credential=credential)

analyzer = {'sc': 'zh-Hans.microsoft', 'en': 'en.microsoft', 'tc': 'zh-Hant.microsoft'}

def create_search_index():
    index = SearchIndex(
        name=index_name,
        fields=[
            SimpleField(name="id", type="Edm.String", key=True),
            SearchableField(name="content", type="Edm.String", analyzer_name=analyzer[LANG]),
            SearchField(name="embedding", type=SearchFieldDataType.Collection(SearchFieldDataType.Single), 
                        hidden=False, searchable=True, filterable=False, sortable=False, facetable=False,
                        vector_search_dimensions=1536, vector_search_configuration="default"),
            SearchableField(name="title", type="Edm.String", analyzer_name=analyzer[LANG]),
            SimpleField(name="address", type="Edm.String", filterable=False, facetable=True),
            SimpleField(name="topic", type="Edm.String", filterable=True, facetable=True)
        ],
        semantic_settings=SemanticSettings(
            configurations=[SemanticConfiguration(
                name='default',
                prioritized_fields=PrioritizedFields(
                    title_field=None, prioritized_content_fields=[SemanticField(field_name='content')]))]),
            vector_search=VectorSearch(
                algorithm_configurations=[
                    VectorSearchAlgorithmConfiguration(
                        name="default",
                        kind="hnsw",
                        hnsw_parameters=HnswParameters(metric="cosine") 
                    )
                ]
            )        
        )
    print(f"Creating search index")
    client.create_index(index)

create_search_index()