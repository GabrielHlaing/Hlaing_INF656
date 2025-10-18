const fs = require("fs").promises;
const path = require("path");

const itemsFile = path.join(__dirname, "..", "model", "items.json");

// Helper: read all items
async function readItems() {
  try {
    const data = await fs.readFile(itemsFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // Return empty array if file missing or invalid
    return [];
  }
}

// Helper: write all items
async function writeItems(items) {
  await fs.writeFile(itemsFile, JSON.stringify(items, null, 2), "utf8");
}

// GET all items
const getAllItems = async (req, res) => {
  try {
    const items = await readItems();
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No items found!" });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET one item by ID
const getItem = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Item ID is required!" });
  }

  try {
    const items = await readItems();
    const item = items.find((i) => i.id === Number(id));
    if (!item) {
      return res.status(404).json({ message: `No item matches ID ${id}` });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new item
const createItem = async (req, res) => {
  const { name, category, price } = req.body;
  if (!name || !category || !price) {
    return res
      .status(400)
      .json({ message: "Please include name, category, and price!" });
  }

  try {
    const items = await readItems();

    // Auto-increment ID
    const maxId = items.reduce(
      (max, item) => (item.id > max ? item.id : max),
      0
    );
    const newItem = {
      id: maxId + 1,
      name,
      category,
      price: Number(price),
    };

    items.push(newItem);
    await writeItems(items);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE item
const updateItem = async (req, res) => {
  const { id, name, category, price } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Item ID is required!" });
  }

  try {
    const items = await readItems();
    const updateItem = items.find((i) => i.id === Number(id));

    if (!updateItem) {
      return res.status(404).json({ message: `No item matches ID ${id}` });
    }

    // Update only provided fields
    if (name) updateItem.name = name;
    if (category) updateItem.category = category;
    if (price) updateItem.price = Number(price);

    await writeItems(items);
    res.json(updateItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE item
const deleteItem = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Item ID is required!" });
  }

  try {
    const items = await readItems();
    const itemToDelete = items.find((i) => i.id === Number(id));

    if (!itemToDelete) {
      return res.status(404).json({ message: `No item matches ID ${id}` });
    }

    // Delete the item
    const updatedItems = items.filter((i) => i.id !== Number(id));
    await writeItems(updatedItems);

    res.json({
      message: "Item deleted successfully",
      deleted: itemToDelete,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
