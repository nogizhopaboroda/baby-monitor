package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
  ReadBufferSize:  1024,
  WriteBufferSize: 1024,
  CheckOrigin: func(r *http.Request) bool {
      return true
  },
}

type hub struct {
	messages    chan []byte
	connections map[int]*websocket.Conn
	addConn     chan *websocket.Conn
}

func (h *hub) sendAll(message []byte) {
	expired := []int{}
	for i, conn := range h.connections {
		err := conn.WriteMessage(websocket.BinaryMessage, []byte(message))
		if err != nil {
			conn.Close()
			expired = append(expired, i)
		}
	}
	// Prune the obsolete connections
	if len(expired) > 0 {
		for _, connId := range expired {
			log.Println("Closed connection:", connId)
			delete(h.connections, connId)
		}
	}
}

func (h *hub) Run() {
	id := 0
	for {
		select {
		// Client has connected
		case c := <-h.addConn:
			log.Println("New connection:", id)
			h.connections[id] = c
			id++
		// A new message has been received
		case c := <-h.messages:
			h.sendAll([]byte(c))
		}
	}
}

// Initialize our main hub struct
var h = &hub{
	messages:    make(chan []byte),
	connections: make(map[int]*websocket.Conn),
	addConn:     make(chan *websocket.Conn),
}


func receive(fileName string) {

	file, err := os.OpenFile(fileName, os.O_RDONLY, os.ModeNamedPipe)
	if err != nil {
		log.Fatal("Open named pipe file error:", err)
	}

	reader := bufio.NewReader(file)

	for {
		line, err := reader.ReadBytes('\n')
		if err == nil {
                        h.messages <- []byte(line)
		}
	}
}

// Handle upgrades to websocket
func connectionHandler(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	h.addConn <- c
}

func main() {

	portNo := flag.Int("p", 8080, "server port")
	fileName := flag.String("i", "", "input source")
	flag.Parse()

	go receive(*fileName)

	go h.Run()

	log.Printf("Serving on %d...", *portNo)
	http.HandleFunc("/", connectionHandler)
	http.ListenAndServe(fmt.Sprintf(":%d", *portNo), nil)
}
