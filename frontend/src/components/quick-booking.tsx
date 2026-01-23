import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function QuickBooking() {
  const [date, setDate] = useState<Date>();
  const [sport, setSport] = useState("");
  const [time, setTime] = useState("");

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <Card className="bg-card border-border max-w-4xl mx-auto">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-foreground">
              Reserva Rápida
            </CardTitle>
            <p className="text-muted-foreground">
              Encuentra y reserva tu pista en segundos
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Deporte" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="padel">Pádel</SelectItem>
                  <SelectItem value="tenis">Tenis</SelectItem>
                  <SelectItem value="futbol">Fútbol Sala</SelectItem>
                  <SelectItem value="basket">Baloncesto</SelectItem>
                  <SelectItem value="natacion">Natación</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal bg-input border-border text-foreground hover:bg-secondary">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "PPP", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-popover border-border"
                  align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Hora" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
