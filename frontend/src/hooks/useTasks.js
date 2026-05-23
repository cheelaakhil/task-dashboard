"use client";
import { useState, useEffect, useCallback } from "react";
import { taskAPI } from "@/lib/api";
import toast from "react-hot-toast";

export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskAPI.getAll(filters);
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data) => {
    try {
      const res = await taskAPI.create(data);
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Task created!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create task");
      throw err;
    }
  };

  const updateTask = async (id, data) => {
    try {
      const res = await taskAPI.update(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      toast.success("Task updated!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update task");
      throw err;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await taskAPI.updateStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, updateStatus, deleteTask };
}
