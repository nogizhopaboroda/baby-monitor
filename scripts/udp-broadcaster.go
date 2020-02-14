package main

import (
    "bufio"
    "log"
    "os"
    "fmt"
    "net"
    "flag"
)

type ConnectionHandler func (net.Listener)


type SocketServer struct {
    port string
}

type hub struct {
	messages    chan []byte
	connections map[int]net.Conn
	addConn     chan net.Conn
}

var h = &hub{
	messages:    make(chan []byte),
	connections: make(map[int]net.Conn),
	addConn:     make(chan net.Conn),
}

func (h *hub) sendAll(message []byte) {
	// expired := []int{}
	for _, conn := range h.connections {
		conn.Write([]byte(message))
		// fmt.Println("data")
		// if err != nil {
			// conn.Close()
			// expired = append(expired, i)
		// }
	}
	// // Prune the obsolete connections
	// if len(expired) > 0 {
		// for _, connId := range expired {
			// log.Println("Closed connection:", connId)
			// delete(h.connections, connId)
		// }
	// }
}

func (h *hub) Run() {
        counter := 0

        for {
            select {
            case conn := <-h.addConn:
                h.connections[counter] = conn
                counter = counter + 1
                fmt.Println("Client connected")
            case c := <-h.messages:
		h.sendAll([]byte(c))
            }
        }
}

func connectionHandler(ln net.Listener) {
        conn, err := ln.Accept()
        if err != nil {
            panic(err)
        }

	h.addConn <- conn
}

func (s *SocketServer) Serve(port string, connectionHandler ConnectionHandler) {
    ln, err := net.Listen("tcp", port)
    if err != nil {
        panic(err)
    }


    // connection queue
    for {
      connectionHandler(ln)
    }
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

func main() {
    fileName := flag.String("i", "", "input source")
    flag.Parse()

    sa := new(SocketServer)

    go receive(*fileName)

    go h.Run()
    sa.Serve(":1235", connectionHandler)
}
