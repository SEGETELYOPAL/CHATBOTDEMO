<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chatbot_flows', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('keywords');
            $table->text('reply');
            $table->enum('type', ['text', 'products'])->default('text');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('priority')->default(100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatbot_flows');
    }
};
