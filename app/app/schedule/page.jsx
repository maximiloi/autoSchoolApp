'use client';

import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SCHEDULE } from '@/data/schedule';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const ItemType = 'CARD';

const DraggableCard = ({ topic }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { topic },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-pointer rounded-md border bg-white p-2 shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <strong>{topic.number}</strong> - {topic.name} ({topic.hours} ч.)
    </div>
  );
};

const ScheduleDay = ({ day, schedule, setSchedule, index }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => handleDrop(item.topic),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleDrop = (topic) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[index].topics.push(topic);
      return newSchedule;
    });
  };

  return (
    <div ref={drop} className={`rounded-md border bg-gray-100 p-4 ${isOver ? 'bg-blue-100' : ''}`}>
      <strong>
        {day.date} {day.time}
      </strong>
      {day.topics.length > 0 ? (
        day.topics.map((topic, idx) => (
          <div key={idx} className="mt-1 rounded-md border bg-white p-2">
            {topic.name} ({topic.hours} ч.)
          </div>
        ))
      ) : (
        <p className="text-gray-500">Перетащите тему сюда</p>
      )}
    </div>
  );
};

export default function ScheduleBoard() {
  const [schedule, setSchedule] = useState([]);
  const [availableTopics, setAvailableTopics] = useState(
    SCHEDULE.flatMap((section) => section.topics),
  );
  const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newTime, setNewTime] = useState('09:00');

  const addDay = () => {
    setSchedule((prev) => [...prev, { date: newDate, time: newTime, topics: [] }]);
  };

  const removeTopicFromAvailable = (topic) => {
    setAvailableTopics((prev) => prev.filter((t) => t.name !== topic.name));
  };

  const downloadSchedule = () => {
    const blob = new Blob([JSON.stringify(schedule, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'schedule.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-xl font-bold">Составление расписания</h1>
        <div className="mb-4 flex gap-2">
          <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
          <Button variant="outline" onClick={addDay}>
            Добавить день
          </Button>
          <Button variant="outline" onClick={downloadSchedule}>
            Скачать расписание
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Доступные темы</h2>
            <div className="space-y-2">
              {availableTopics.map((topic, index) => (
                <DraggableCard key={index} topic={topic} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Ваше расписание</h2>
            {schedule.length > 0 ? (
              schedule.map((day, index) => (
                <ScheduleDay
                  key={index}
                  day={day}
                  schedule={schedule}
                  setSchedule={setSchedule}
                  index={index}
                />
              ))
            ) : (
              <p className="text-gray-500">Добавьте день занятий</p>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
