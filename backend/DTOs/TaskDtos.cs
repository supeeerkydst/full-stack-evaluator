namespace TaskManager.Dtos {
    // Payload expected when creating a Task
    public record TaskCreateDto {
        public string Title { get; init; } = string.Empty;
        public bool IsDone { get; init; }
        public int? UserId { get; init; }
    }

    // payloads are expected when updating a Task
    public record TaskUpdateDto {
        public string Title { get; init; } = string.Empty;
        public bool IsDone { get; init; }
    }
}
