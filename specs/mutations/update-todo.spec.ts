import { updateTask } from "../../graphql/resolvers/mutations/todo";
import { TodoModel } from "../../graphql/schemas";

jest.mock("../../graphql/schemas", () => ({
  TodoModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe("updateTask", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a task successfully with both title and completed", async () => {
    const mockUpdatedTask = {
      id: "1",
      title: "Updated Task",
      completed: true,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedTask
    );

    const result = await updateTask(null, {
      id: "1",
      title: "Updated Task",
      completed: true,
    });

    expect(TodoModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "1" },
      {
        $set: {
          title: "Updated Task",
          completed: true,
        },
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedTask);
  });

  it("should update a task with only title", async () => {
    const mockUpdatedTask = {
      id: "1",
      title: "Updated Task",
      completed: false,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedTask
    );

    const result = await updateTask(null, {
      id: "1",
      title: "Updated Task",
    });

    expect(TodoModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "1" },
      {
        $set: {
          title: "Updated Task",
        },
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedTask);
  });

  it("should update a task with only completed status", async () => {
    const mockUpdatedTask = {
      id: "1",
      title: "Original Task",
      completed: true,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedTask
    );

    const result = await updateTask(null, {
      id: "1",
      completed: true,
    });

    expect(TodoModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "1" },
      {
        $set: {
          completed: true,
        },
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedTask);
  });

  it("should update a task with completed set to false", async () => {
    const mockUpdatedTask = {
      id: "1",
      title: "Original Task",
      completed: false,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedTask
    );

    const result = await updateTask(null, {
      id: "1",
      completed: false,
    });

    expect(TodoModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "1" },
      {
        $set: {
          completed: false,
        },
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedTask);
  });

  it("should throw an error if task not found", async () => {
    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(
      updateTask(null, { id: "1", title: "Does not exist" })
    ).rejects.toThrow("Task not found");
  });

  it("should handle database errors gracefully", async () => {
    (TodoModel.findOneAndUpdate as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(
      updateTask(null, { id: "1", title: "Test" })
    ).rejects.toThrow("Database connection failed");
  });
});
