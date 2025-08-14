import { deleteTodo } from "../../graphql/resolvers/mutations/todo";
import { TodoModel } from "../../graphql/schemas";

jest.mock("../../graphql/schemas", () => ({
  TodoModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe("deleteTodo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a todo with title and completed successfully", async () => {
    const mockUpdatedTodo = {
      id: "1",
      title: "Updated Todo",
      completed: true,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedTodo
    );

    const result = await deleteTodo(null, {
      id: "1",
      title: "Updated Todo",
      completed: true,
    });

    expect(TodoModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "1" },
      {
        $set: {
          title: "Updated Todo",
          completed: true,
        },
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedTodo);
  });

  it("should update a todo with only title", async () => {
    const mockUpdatedTodo = {
      id: "1",
      title: "Updated Todo",
      completed: false,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedTodo
    );

    const result = await deleteTodo(null, {
      id: "1",
      title: "Updated Todo",
    });

    expect(TodoModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "1" },
      {
        $set: {
          title: "Updated Todo",
        },
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedTodo);
  });

  it("should update a todo with only completed status", async () => {
    const mockUpdatedTodo = {
      id: "1",
      title: "Original Todo",
      completed: true,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedTodo
    );

    const result = await deleteTodo(null, {
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
    expect(result).toEqual(mockUpdatedTodo);
  });

  it("should update a todo with completed set to false", async () => {
    const mockUpdatedTodo = {
      id: "1",
      title: "Original Todo",
      completed: false,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedTodo
    );

    const result = await deleteTodo(null, {
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
    expect(result).toEqual(mockUpdatedTodo);
  });

  it("should throw an error if todo not found", async () => {
    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(
      deleteTodo(null, { id: "1", title: "Does not exist" })
    ).rejects.toThrow("Failed to update todo");
  });

  it("should handle database errors gracefully", async () => {
    (TodoModel.findOneAndUpdate as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(
      deleteTodo(null, { id: "1", title: "Test" })
    ).rejects.toThrow("Failed to update todo");
  });

  it("should handle case with no update parameters", async () => {
    const mockTodo = {
      id: "1",
      title: "Original Todo",
      completed: false,
    };

    (TodoModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockTodo);

    const result = await deleteTodo(null, { id: "1" });

    expect(TodoModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "1" },
      {
        $set: {},
      },
      { new: true }
    );
    expect(result).toEqual(mockTodo);
  });
}); 