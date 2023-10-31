function StaticSprintNode(props) {
  const { data, selected } = props;

  return (
    <>
      <div
        style={{
          padding: 0,
          borderRadius: 5,
          border: "1px solid",
          background: selected ? "rgba(255, 0, 0, 0.2)" : data?.color,
          borderColor: selected ? "rgba(255, 0, 0, 0.8)" : data?.borderColor,
          height: `${data?.height}px`,
          width: `${data?.width}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              paddingLeft: 5,
              color: "#000",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            {data.label}
          </div>

          {data.sprintNumber ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#000",
                fontWeight: "600",
                fontSize: "16px",
                margin: 3,
                padding: 3,
                borderRadius: 50,
                border: "1px solid #bbb",
                background: "#ccc",
                minWidth: 20,
                minHeight: 20,
              }}
            >
              {data.sprintNumber}
            </div>
          ) : null}
        </div>

        <div
          style={{
            color: "#777",
            fontWeight: "500",
            fontSize: "10px",
            textAlign: "right",
            paddingRight: 5,
            paddingBottom: 5,
          }}
        >
          {data.duration ? `${data.duration} d` : null}
        </div>
      </div>
    </>
  );
}

export default StaticSprintNode;
