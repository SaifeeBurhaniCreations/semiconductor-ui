1. Support Tickets Database (tickets.json)
code
JSON
[
  {
    "id": "TICKET-1024",
    "userId": "USR-001",
    "type": "Technical Issue", // or "Billing", "Feature Request"
    "subject": "Simulation Latency Spike",
    "description": "Experiencing >500ms delay in Sector 7 rendering.",
    "status": "In Progress", // "Open", "In Progress", "Resolved", "Closed"
    "priority": "High",
    "createdAt": "2025-10-24T10:00:00Z",
    "updatedAt": "2025-10-24T12:30:00Z",
    "logsAttached": true
  }
]
2. Knowledge Base Database (kb.json)
code
JSON
[
  {
    "id": "KB-001",
    "title": "Resolving Error 503 in Quantum Core",
    "category": "Troubleshooting",
    "tags": ["error", "core", "connectivity"],
    "content": "Step 1: Check the bridge connection...",
    "views": 1420
  }
]
3. Simulation Presets Database (presets.json)
code
JSON
[
  {
    "id": "PRESET-001",
    "title": "Standard Reflow",
    "description": "Baseline thermal profile for SAC305.",
    "tags": ["Thermal", "Production"],
    "config": {
      "temp_max": 240,
      "ramp_rate": 2.5,
      "atmosphere": "N2"
    },
    "author": "System_Default",
    "created": "2025-01-01"
  }
]
