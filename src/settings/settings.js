
//------------server's port
const port='http://localhost:3003'

//-------------three main function
const getPageRank =  port+    '/pageRank';
const getShortestPath = port + '/shortestPath'
// const getCommunityDetect= port+'/communityDetect'
const getCommunityDetect = 'community/community.json'



//-----------file list
// const node_4000_hierarchy='clustery/community_graph.json'
const node_4000_hierarchy='data/node_4000_hierarchy.json'
const node_4000_node_link='data/node_4000_node_link.json'
const node_70_hierarchy='data/node_70_hierarchy.json'
const node_70_node_link='data/node_70_node_link.json'
const node_25_node_link = 'data/node_25_node_link.json'
const node_4000_node_link_circle='data/node_4000_node_link_circle.json'
const node_4000_node_link_square='data/node_4000_node_link_square.json' 

//------------default outlook style 
const canvas_background = '#121212'
const important_font = '#E0E0E0'
const plain_text = '#A0A0A0'
const card_background = "#292929"
const inner_card_background = "rgba(255,255,255,0.1)"
const dividar_color='#595959'
const node_color = {
    r: 44,
    g: 146,
    b: 255,
    a: 255
} ;
const edge_color =  {
    r: 224,
    g: 224,
    b: 224,
    a: 150
};
const source_node_clicked = { r: 130, g: 0, b: 20, a: 255 }
const red = {
    r: 255,
    g: 0,
    b: 0,
    a:255
}
const highlightEdge = {
     r: 225, g: 157, b: 84, a: 255 
}
export {
getPageRank,getCommunityDetect,getShortestPath,canvas_background,
important_font,plain_text,card_background,node_color,edge_color,inner_card_background,dividar_color,source_node_clicked,red,highlightEdge,
node_4000_hierarchy,node_4000_node_link,node_70_hierarchy,node_70_node_link,node_25_node_link,node_4000_node_link_circle,node_4000_node_link_square}