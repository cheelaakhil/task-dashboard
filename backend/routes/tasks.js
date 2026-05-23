const express = require("express");
const { body, param, validationResult } = require("express-validator");
const supabase = require("../config/supabase");

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const taskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
  body("description").optional().trim().isLength({ max: 2000 }),
  body("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Status must be todo, in_progress, or completed"),
  body("due_date").optional({ nullable: true }).isISO8601().withMessage("Invalid date format"),
];

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const { status, search, sort_by = "created_at", order = "desc" } = req.query;

    let query = supabase.from("tasks").select("*");

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const validSortFields = ["created_at", "updated_at", "due_date", "title"];
    const sortField = validSortFields.includes(sort_by) ? sort_by : "created_at";
    query = query.order(sortField, { ascending: order === "asc" });

    const { data, error } = await query;

    if (error) throw error;
    res.json({ tasks: data, count: data.length });
  } catch (error) {
    console.error("GET /tasks error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET single task
router.get("/:id", param("id").isUUID(), validate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Task not found" });

    res.json(data);
  } catch (error) {
    if (error.code === "PGRST116") {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(500).json({ error: error.message });
  }
});

// POST create task
router.post("/", taskValidation, validate, async (req, res) => {
  try {
    const { title, description = "", status = "todo", due_date = null } = req.body;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, description, status, due_date }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update task
router.put(
  "/:id",
  [param("id").isUUID(), ...taskValidation],
  validate,
  async (req, res) => {
    try {
      const { title, description, status, due_date } = req.body;

      const { data, error } = await supabase
        .from("tasks")
        .update({ title, description, status, due_date, updated_at: new Date().toISOString() })
        .eq("id", req.params.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Task not found" });

      res.json(data);
    } catch (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// PATCH update status only
router.patch(
  "/:id/status",
  [
    param("id").isUUID(),
    body("status").isIn(["todo", "in_progress", "completed"]),
  ],
  validate,
  async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status: req.body.status, updated_at: new Date().toISOString() })
        .eq("id", req.params.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Task not found" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE task
router.delete("/:id", param("id").isUUID(), validate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully", id: req.params.id });
  } catch (error) {
    if (error.code === "PGRST116") {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
