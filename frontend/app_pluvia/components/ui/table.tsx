import * as TablePrimitive from '@rn-primitives/table';
import { Text } from "@/components/ui/text";

function Table() {
  return (
    <TablePrimitive.Root aria-labelledby='invoice-table'>

       
      <TablePrimitive.Header>
        <TablePrimitive.Row>
          <TablePrimitive.Head>
            <Text>Invoice</Text>
          </TablePrimitive.Head>
          <TablePrimitive.Head>
            <Text>Status</Text>
          </TablePrimitive.Head>
          <TablePrimitive.Head>
            <Text>Method</Text>
          </TablePrimitive.Head>
          <TablePrimitive.Head>
            <Text>Amount</Text>
          </TablePrimitive.Head>
        </TablePrimitive.Row>
      </TablePrimitive.Header>


      <TablePrimitive.Body>


        <TablePrimitive.Row>
          <TablePrimitive.Cell>
            <Text>INV001</Text>
          </TablePrimitive.Cell>
          <TablePrimitive.Cell>
            <Text>Paid</Text>
          </TablePrimitive.Cell>
          <TablePrimitive.Cell>
            <Text>$250.00</Text>
          </TablePrimitive.Cell>
          <TablePrimitive.Cell>
            <Text>Credit Card</Text>
          </TablePrimitive.Cell>
        </TablePrimitive.Row>


        <TablePrimitive.Footer>
          <TablePrimitive.Row>
            <TablePrimitive.Cell>
              <Text>Total</Text>
            </TablePrimitive.Cell>
            <TablePrimitive.Cell>
                <Text>$250.00</Text>
            </TablePrimitive.Cell>
          </TablePrimitive.Row>
        </TablePrimitive.Footer>
        <Text nativeID='invoice-table'>
          A list of your recent invoices.
        </Text>
      </TablePrimitive.Body>
    </TablePrimitive.Root>
  );
}

export {Table}