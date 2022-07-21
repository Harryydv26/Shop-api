const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//productSchema

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        name: token
 *        in : header
 *  schemas:
 *    Product:
 *      type: object
 *      required:
 *        -title
 *        -img
 *        -desc
 *        -price
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the book
 *        title:
 *          type: string
 *          description: the title
 *        img:
 *          type: string
 *          description: the img
 *        desc:
 *          type: string
 *          description: the desc
 *        price:
 *          type: number
 *          description: the price
 *      example:
 *        id:74njfn
 *        title:shorts
 *        desc:the nike sweat shorts
 *        price:75
 *
 */

  
  
  


//CREATE

/**
 * @swagger
 *  /api/products:
 *    post:
 *      security:
 *        - bearerAuth : [{ name: "Token"
 * }]
 *
 *      summary: Add a new Product
 *      tags: [Products]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *      responses:
 *        200:
 *          description: The product was successfully created
 *        content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        400:
 *           description: Some server error
 *
 *
 */


router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
/**
 * @swagger
 * /api/products/find/{id}:
 *  get:
 *    summary: Get the products by id
 *    tags: [Products]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *            type: string
 *         required: true
 *         description: products id
 *    responses:
 *      200:
 *        description: The product description
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: The product was not found
 *
 */
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;