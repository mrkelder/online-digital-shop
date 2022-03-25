# API Endpoints

In this section you can find all API endpoints, their intentions and return values

## CreatePaymentIntent

Endpoint: **/api/createPaymentIntent**

The endpoint supports _POST_ method and takes a JSON.stringified collection of objects. These objects represent the items a user want to purchase. The shape is below

```ts
interface Item {
  id: string;
  quantity: number;
}

const items: Item[] = [...]

const body = JSON.stringify(items)
```

In case of a successful request user retrieves a client secret for a stripe payment.
