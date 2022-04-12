# API Endpoints

In this section you can find all API endpoints, their intentions and return values

## Sections Of Content

- [CreatePaymentIntent](#createpaymentintent)
- [GetCategory](#getcategory)
- [GetCity](#getcity)
- [GetItem](#getitem)
- [GetRecommendations](#getrecommendations)
- [GetSlider](#getslider)

## CreatePaymentIntent

method: _POST_

Endpoint: **/api/createPaymentIntent**

The endpoint takes a JSON.stringified collection of objects for the body. These objects represent the items a user wants to purchase. The shape is below

```ts
interface Item {
  id: string;
  quantity: number;
}

const items: Item[] = [...]

const body = JSON.stringify(items)
```

In case of a successful request user retrieves a client secret for a stripe payment.

Return value:

```ts
type Response = string; // stripe client secret
```

## GetCategory

Method: _GET_

Endpoint: **/api/getCategory**

Returns all categories in the database

```ts
type Response = Category[];
```

Endpoint: **/api/getCategory/:id**

Returns a single category by id

```ts
type Response = Category;
```

## GetCity

Method: _GET_

Endpoint: **/api/getCity**

Returns all cities in the database

```ts
type Response = City[];
```

Endpoint: **/api/getCity/:id**

Returns a particular city by id

```ts
type Response = City;
```

## GetItem

Method: _GET_

Endpoint: **/api/getItem**

Returns all items that are eligible to query parameters

```ts
interface Query {
  subCategoryId?: string;
  min?: string; // min price
  max?: string; // max price
  page?: string; // pagination page
  c?: string | string[];
}

type Response = Item[];
```

Endpoint: **/api/getCity/:id**

Returns a certain item by id

```ts
type Response = Item;
```

## GetRecommendations

Method: _GET_

Endpoint: **/api/getRecommendations**

Retrieves a list of recommended items displayed on the main page

```ts
type Response = Recommendation[];
```

## GetSlider

Method: _GET_

Endpoint: **/api/getSlider**

Respondes with a collection of slides for a slider on the main page

```ts
type Response = Slide[];
```
