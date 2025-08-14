import { addTodo } from "../../graphql/resolvers/mutations/todo";
import { TodoModel } from "../../graphql/schemas";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../graphql/schemas", () => ({
  TodoModel: {
    create: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

describe("addTodo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new todo successfully", async () => {
    const mockTodo = {
      id: "mocked-uuid",
      title: "Test Task",
      completed: false,
    };

    (TodoModel.create as jest.Mock).mockResolvedValue(mockTodo);

    const result = await addTodo(null, { title: "Test Task" });

    expect(TodoModel.create).toHaveBeenCalledWith({
      id: "mocked-uuid",
      title: "Test Task",
      completed: false,
    });
    expect(result).toEqual(mockTodo);
  });

  it("should create a todo with empty title", async () => {
    const mockTodo = {
      id: "mocked-uuid",
      title: "",
      completed: false,
    };

    (TodoModel.create as jest.Mock).mockResolvedValue(mockTodo);

    const result = await addTodo(null, { title: "" });

    expect(TodoModel.create).toHaveBeenCalledWith({
      id: "mocked-uuid",
      title: "",
      completed: false,
    });
    expect(result).toEqual(mockTodo);
  });

  it("should create a todo with very long title", async () => {
    const longTitle = "A".repeat(1000);
    const mockTodo = {
      id: "mocked-uuid",
      title: longTitle,
      completed: false,
    };

    (TodoModel.create as jest.Mock).mockResolvedValue(mockTodo);

    const result = await addTodo(null, { title: longTitle });

    expect(TodoModel.create).toHaveBeenCalledWith({
      id: "mocked-uuid",
      title: longTitle,
      completed: false,
    });
    expect(result).toEqual(mockTodo);
  });

  it("should throw an error if creation fails", async () => {
    (TodoModel.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await expect(addTodo(null, { title: "Fail Task" })).rejects.toThrow(
      "Failed to add todo"
    );
  });

  it("should handle database connection errors", async () => {
    (TodoModel.create as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(addTodo(null, { title: "Fail Task" })).rejects.toThrow(
      "Failed to add todo"
    );
  });

  it("should handle validation errors", async () => {
    (TodoModel.create as jest.Mock).mockRejectedValue(
      new Error("Validation failed")
    );

    await expect(addTodo(null, { title: "Fail Task" })).rejects.toThrow(
      "Failed to add todo"
    );
  });

  it("should handle network timeout errors", async () => {
    (TodoModel.create as jest.Mock).mockRejectedValue(
      new Error("Network timeout")
    );

    await expect(addTodo(null, { title: "Fail Task" })).rejects.toThrow(
      "Failed to add todo"
    );
  });
});
