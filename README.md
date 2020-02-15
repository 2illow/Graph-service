# 2illow Graph CRUD API
## Create
**Endpoint: /api/graphs/properties (POST)**
Accepts JSON data with property information and adds it to the DB.
Each element in estimates should have a corresponding date at the same index in dates.
example request body: 
```
{
  property: {
    name: 'propertyname',
    estimates: [300000, 40000, ...],
    dates: ['1/1/1111', '1/2/1111', ...],
    listedprice: 300000,
    listeddate: '1/1/1111',
    soldprice: 300000,
    solddate: '1/1/1111',
    neighborhood: 5
  }
}
```
response body contains insert ID.

## Read
**Endpoint: /api/graphs/properties/:id (GET)**
Returns graph data for the property ID and associated neighborhood/city.
Each data point in estimates represents a month.
cestimates is city estimates; nestimates is neighborhood estimates
response example: 
```
{
  city: {
    name: 'cityname',
    id: 1,
    estimates: [300000, 40000, ...],
    dates: ['1/1/1111', '1/2/1111', ...]     
  },
  neighborhood: {
    name: 'neighborhoodname',
    id: 1,
    estimates: [300000, 40000, ...],
    dates: ['1/1/1111', '1/2/1111', ...] 
  },
  property: {
    name: 'propertyname',
    id: 1,
    estimates: [300000, 40000, ...],
    dates: ['1/1/1111', '1/2/1111', ...], 
    listedprice: 300000,
    listeddate: '1/1/1111',
    soldprice: 300000,
    solddate: '1/1/1111'
  }
}
```

**Legacy endpoint: /seed (GET)**
Originally adds an entry to the DB and sends that entry back as response.
sample data:
```
[ { graphData: 
   { city: 
      { price: [120 length array],
        name: 'San Francisco' },
     neighborhood: 
      { price: [120 length array],
        name: 'Marina' },
     property: 
      { price: [120 length array],
        sold: [ 956341, 34 ],
        name: '531 Kirkham St, San Francisco, CA 94122' 
      } 
   },
  _id: 5e4456e3b4798a40248be9e2,
  id: 0,
  zestimate: '$1,225,583',
  updateZestimate: 'https://www.zillow.com/sellerlanding/edityourhome/0',
  salesRange: '$1.10M - $1.34M',
  __v: 0 
} ]
```
## Update
**Endpoint: /api/graphs/properties/:id/estimates (PATCH)**
Accepts JSON with date/estimate pair or listed/sold date/estimate pair
request body 1:
```
{date: '1/1/1111', estimate: 1000000}
```
request body 2:
```
{listeddate: '1/1/1111', listedprice: 100000}
```

## Delete
**Endpoint: /api/graphs/properties/:id**
Deletes all property data for a specific property id

response: HTTP code 200 if successful

