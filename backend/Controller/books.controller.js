const Books = require("../Model/books.model");
const { validationResult } = require("express-validator");

const addNewBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", message: errors.array() });
    }

    const newBook = new Books(req.body);
    const response = await newBook.save();

    res.json({
      status: "success",
      data: { newBook: response },
      message: "new book added successfully",
    });
  } catch (err) {
    res.json({ status: "error", message: "Something Went Wrong" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const books = await Books.find().limit(limit).skip(skip);
    if (books.length) {
      res.json({
        status: "success",
        data: { books },
      });
    } else {
      res.json({ status: "fail", data: { books }, message: "no books found" });
    }
  } catch {
    res.json({ status: "error", message: "Something Went Wrong" });
  }
};

const getBookById = async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const book = await Books.find({ _id: bookId });

    if (book.length == 0) {
      res.json({ status: "fail", data: { book }, message: "book not found" });
    } else {
      res.json({ status: "success", data: { book } });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: "incorrect Id Format" });
  }
};

const getBookByAuthorId = async (req, res) => {
  const authorId = req.params.authorId;
  try {
    const books = await Books.find({ author: authorId });

    if (books.length == 0) {
      res.json({ status: "fail", data: { books }, message: "book not found" });
    } else {
      res.json({ status: "success", data: { books } });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: "incorrect Id Format" });
  }
};

const getBookByCategoryId = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const books = await Books.find({ category: categoryId });

    if (books.length == 0) {
      res.json({ status: "fail", data: { books }, message: "book not found" });
    } else {
      res.json({ status: "success", data: { books } });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: "incorrect Id Format" });
  }
};

const updateBookById = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const bookId = req.params.bookId;
    const oldBook = await Books.findOneAndUpdate(
      { _id: bookId },
      { $set: { ...req.body } }
    );

    if (oldBook.length == 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "book id not found " });
    }
    return res.json({
      status: "seccess",
      message: "book updated successfully",
      data: { book: { ...oldBook["_doc"], ...req.body } },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "Something Went Wronge error: " });
  }
};

const deleteBookById = async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const deletionRes = await Books.deleteOne({ _id: bookId });
    if (deletionRes.deletedCount === 0) {
      return res.json({ status: "fail", message: "book not found" });
    }
    res.json({ status: "success", message: "book deleted successfully" });
  } catch {
    res.status(500).json({
      status: "error",
      message: "Error deleting book",
    });
  }
};

module.exports = {
  deleteBookById,
  addNewBook,
  getBookById,
  getBookByAuthorId,
  getBookByCategoryId,
  getAllBooks,
  updateBookById,
};
