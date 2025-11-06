"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon, SearchIcon, FilterIcon, MoreVerticalIcon, EditIcon, TrashIcon, PackageIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  size?: string
  gender?: string
  quantity: number
  price: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  lastUpdated: string
}

const mockInventory: InventoryItem[] = [
  {
    "id": "1",
    "name": "Abrigo Elegante Mujer",
    "sku": "ABR-001",
    "category": "ABRIGO",
    "size": "S",
    "gender": "Mujer",
    "quantity": 15,
    "price": 129.99,
    "status": "in-stock",
    "lastUpdated": "2025-11-06"
  },
  {
    "id": "2",
    "name": "Bermuda de Jean Hombre",
    "sku": "BER-002",
    "category": "BERMUDA",
    "size": "M",
    "gender": "Hombre",
    "quantity": 30,
    "price": 35.50,
    "status": "low-stock",
    "lastUpdated": "2025-11-06"
  },
  {
    "id": "3",
    "name": "Buzo con Capucha Niño",
    "sku": "BUZ-003",
    "category": "BUZO",
    "size": "8",
    "gender": "Niño",
    "quantity": 50,
    "price": 45.00,
    "status": "in-stock",
    "lastUpdated": "2025-11-06"
  },
  {
    "id": "4",
    "name": "Camisa Casual Niña",
    "sku": "CAM-004",
    "category": "CAMISAS",
    "size": "12",
    "gender": "Niña",
    "quantity": 22,
    "price": 28.75,
    "status": "in-stock",
    "lastUpdated": "2025-11-06"
  },
  {
    "id": "5",
    "name": "Falda Midi Estampada",
    "sku": "FAL-005",
    "category": "FALDA",
    "size": "XS",
    "gender": "Mujer",
    "quantity": 8,
    "price": 59.90,
    "status": "low-stock",
    "lastUpdated": "2025-11-06"
  },
  {
    "id": "6",
    "name": "Jean Terminado Slim Hombre",
    "sku": "JNS-006",
    "category": "JEANS TERMINADOS",
    "size": "XL",
    "gender": "Hombre",
    "quantity": 0,
    "price": 68.00,
    "status": "out-of-stock",
    "lastUpdated": "2025-11-06"
  },
  {
    "id": "7",
    "name": "Pantalón Chino Niño",
    "sku": "PNT-007",
    "category": "PANTALONES",
    "size": "16",
    "gender": "Niño",
    "quantity": 40,
    "price": 39.99,
    "status": "in-stock",
    "lastUpdated": "2025-11-06"
  },
  {
    "id": "8",
    "name": "T-Shirt Estampada Niña",
    "sku": "TSH-008",
    "category": "TSHIRT TERMINADA",
    "size": "4",
    "gender": "Niña",
    "quantity": 60,
    "price": 19.50,
    "status": "in-stock",
    "lastUpdated": "2025-11-06"
  }
]
export default function InventoryPage() {
  const inventoryFilter = useStore((state) => state.inventoryFilter)
  const setInventoryFilter = useStore((state) => state.setInventoryFilter)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    price: "",
  })

  useEffect(() => {
    if (inventoryFilter) {
      setSearchQuery(inventoryFilter)
    }
  }, [inventoryFilter])

  const filteredInventory = mockInventory.filter((item) => {
    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.size && item.size.toLowerCase().includes(query)) ||
      (item.gender && item.gender.toLowerCase().includes(query))
    )
  })

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return <Badge variant="default">In Stock</Badge>
      case "low-stock":
        return <Badge variant="secondary">Low Stock</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
    }
  }

  const handleAddItem = () => {
    setIsAddDialogOpen(false)
    setNewItem({ name: "", sku: "", category: "", quantity: "", price: "" })
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value === "") {
      setInventoryFilter("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Inventory Management</h1>
          <p className="text-muted-foreground text-pretty">Manage your product inventory and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Add a new product to your inventory. Fill in all the required fields.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Floral Dress"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="e.g., DRS-001"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Dresses"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Items</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  className="pl-9 pr-4 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <FilterIcon className="size-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <PackageIcon className="size-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No items found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.size || "-"}</TableCell>
                    <TableCell>{item.gender || "-"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{item.lastUpdated}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="size-8 p-0">
                            <MoreVerticalIcon className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <EditIcon className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <TrashIcon className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
